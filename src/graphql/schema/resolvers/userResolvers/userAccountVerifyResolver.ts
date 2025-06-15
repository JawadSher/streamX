import { ApiError } from "@/lib/api/ApiError";
import { connectDB } from "@/lib/database";
import { deleteUserOTPFromRedis } from "@/lib/deleteUserOTPFromRedis";
import { getUserOTPFromRedis } from "@/lib/getUserOTPFromRedis";
import { storeUserOTPInRedis } from "@/lib/storeUserOTPInRedis";
import { extendType, nullable, stringArg } from "nexus";
import User from "@/models/user.model";
import mongoose from "mongoose";
import { generateOTP } from "@/lib/generateOTP";
import { SendVerificationCode } from "@/lib/sendOTP";
import { connectRedis } from "@/lib/redis";
import { ApiResponse } from "@/lib/api/ApiResponse";
import { z } from "zod";
import { GraphQLError } from "graphql";

const allowedStates = ["store", "verify"] as const;
type StateType = (typeof allowedStates)[number];

async function storeOTP(code: string, userId: string) {
  return await storeUserOTPInRedis({ code, userId });
}

async function getOTP(userId: string) {
  return await getUserOTPFromRedis({ userId });
}

async function deleteOTP({
  userId,
  state,
}: {
  userId: string;
  state?: null | string;
}) {
  return await deleteUserOTPFromRedis({ userId, state });
}

async function verifiedUser(userId: string) {
  await deleteOTP({ userId, state: "verify" });
  await connectDB();
  await User.findByIdAndUpdate(userId, {
    $set: {
      isVerified: true,
    },
  });
}

const OTP_Schema = z
  .string()
  .trim()
  .max(6, "OTP should be max 6 digit long")
  .min(6, "OTP should be min 6 digit long");

export const UserAccountVerify = extendType({
  type: "Mutation",
  definition(t) {
    t.field("userAccountVerify", {
      type: "UserAccountVerification",
      args: {
        state: stringArg(),
        u_OTP: nullable(stringArg()),
      },
      resolve: async (_parnt, args, ctx) => {
        try {
          const { user: authUser } = ctx;
          const userId = authUser._id;

          if (!authUser || !authUser._id || !mongoose.isValidObjectId(userId)) {
            ApiError({
              statusCode: 401,
              success: false,
              code: "UNAUTHORIZED",
              message: "Unauthorized request",
              data: null,
            });
          }

          const { state } = args;
          if (!allowedStates.includes(state as StateType)) {
            ApiError({
              statusCode: 400,
              success: false,
              code: "INVALID_STATE",
              message: `Invalid state value. Allowed values: ${allowedStates.join(
                ", "
              )}`,
              data: null,
            });
          }

          switch (state) {
            case "store":
              const redis = await connectRedis();
              const result = await redis.hmget(
                `app:user:${userId}`,
                "email",
                "firstName"
              );
              const userEmail: string = result?.email as string;
              const firstName: string = result?.firstName as string;
              const { OTP, expiryTime } = await generateOTP();

              const response = await storeOTP(OTP, userId);
              if (response === false) {
                ApiError({
                  statusCode: 500,
                  success: false,
                  code: "OTP_STORE_ERROR",
                  message: "Something went wrong. Try again later",
                  data: null,
                });
                break;
              }
              const sendResponse = await SendVerificationCode({
                firstName,
                userEmail,
                OTP,
                expiryTime,
              });

              if (sendResponse.success === false) {
                const delResponse = await deleteOTP(userId);
                if (delResponse === false) {
                  ApiError({
                    statusCode: 400,
                    success: false,
                    code: "OTP_DELETION_ERROR",
                    message: "Something went wrong. Try again later",
                    data: null,
                  });
                  break;
                }

                ApiError({
                  statusCode: 502,
                  success: false,
                  code: "OTP_SENDING_ERROR",
                  message:
                    "Something went wrong while sending OTP to email address",
                  data: null,
                });
                break;
              }

              return ApiResponse({
                statusCode: 200,
                success: true,
                code: "OTP_SENDED",
                message: "Verification code send to your email successfully",
                data: {
                  OTP_Expires_On: expiryTime,
                },
              });

            case "verify":
              const { u_OTP } = args;
              if (!u_OTP) {
                ApiError({
                  statusCode: 400,
                  success: false,
                  code: "OTP_MISSING",
                  message: "OTP is required for verification.",
                  data: null,
                });
                break;
              }

              const get_OTP_res = await getOTP(userId);
              if (!get_OTP_res) {
                ApiError({
                  statusCode: 410,
                  success: false,
                  code: "OTP_EXPIRATION_ERROR",
                  message: "OTP is expired. Try again later",
                  data: null,
                });
                break;
              }

              const OTP_valid_res = await OTP_Schema.safeParse(
                u_OTP.toString()
              );

              if (!OTP_valid_res.success) {
                const error = OTP_valid_res.error.flatten().fieldErrors;
                ApiError({
                  statusCode: 422,
                  success: false,
                  code: "OTP_VALIDATION_ERROR",
                  message: "OTP Validation Error",
                  data: {
                    error,
                  },
                });
                break;
              }

              if (OTP_valid_res.data !== get_OTP_res.toString()) {
                ApiError({
                  statusCode: 401,
                  success: false,
                  code: "INVALID_OTP_ERROR",
                  message: "Please enter correct OTP.",
                  data: null,
                });
                break;
              }

              await verifiedUser(userId);

              return ApiResponse({
                statusCode: 200,
                success: true,
                code: "OTP_VALID",
                message: "Account verification successfull.",
                data: null,
              });

            default:
              ApiError({
                statusCode: 400,
                success: false,
                code: "UNKNOWN_ERROR",
                message: "Something went wrong. Try again later",
                data: null,
              });
          }
        } catch (error: any) {
          if (error instanceof GraphQLError) throw error;
          ApiError({
            statusCode: 500,
            success: false,
            code: "INTERNAL_ERROR",
            message: error.message || "Interal server error",
            data: null,
          });
        }
      },
    });
  },
});
