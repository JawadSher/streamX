import { extendType } from "nexus";
import { fetchUserFromMongoDB } from "@/lib/fetchUserFromMongoDB";
import { getUserFromRedis } from "@/lib/getUserFromRedis";
import { storeUserInRedis } from "@/lib/storeUserInRedis";
import { ApiError } from "@/lib/api/ApiError";
import { ApiResponse } from "@/lib/api/ApiResponse";
import { GraphQLError } from "graphql";
import mongoose from "mongoose";
import { getOTPCoolDown } from "@/lib/getOTPCoolDownRedis";

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getUser", {
      type: "UserResponse",
      resolve: async (_parnt, _args, ctx) => {
        try {
          const { user: authUser } = ctx;

          if (
            !authUser ||
            !authUser._id ||
            !mongoose.isValidObjectId(authUser._id)
          ) {
            ApiError({
              statusCode: 401,
              success: false,
              code: "UNAUTHORIZED",
              message: "Unauthorized request",
              data: null,
            });
          }

          const userId = authUser._id;
          let user = await getUserFromRedis(userId);
          const OTPCoolDown = await getOTPCoolDown(userId);
          if (!OTPCoolDown.success) {
            ApiError({
              statusCode: 500,
              success: false,
              code: "OTP_COOLDOWN_FETCH_ERROR",
              message: "Something went wrong. Try again later",
              data: null,
            });
          }

          if (!user) {
            user = await fetchUserFromMongoDB({ userId });
            if (user) await storeUserInRedis(user);
          }

          if (!user) {
            ApiError({
              statusCode: 404,
              success: false,
              code: "USER_NOT_FOUND",
              message: "User data not found",
              data: null,
            });
          }

          return ApiResponse({
            statusCode: 200,
            success: true,
            code: "USER_FETCHED",
            message: "User fetched successfully",
            data: {
              coolDownData: OTPCoolDown,
              ...user,
              _id: user?._id?.toString(),
            },
          });
        } catch (error: any) {
          if (error instanceof GraphQLError) throw error;
          ApiError({
            statusCode: 400,
            success: false,
            code: "INTERNAL_SERVER_ERROR",
            message:
              error.message || "Something went wrong while fetching user data",
            data: null,
          });
        }
      },
    });
  },
});
