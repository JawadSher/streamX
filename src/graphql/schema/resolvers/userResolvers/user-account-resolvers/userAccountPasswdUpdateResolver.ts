import { ApiError } from "@/lib/api/ApiError";
import { ApiResponse } from "@/lib/api/ApiResponse";
import notifyKakfa from "@/lib/notifyKafka";
import bcrypt from "bcryptjs";
import { GraphQLError } from "graphql";
import { isValidObjectId } from "mongoose";
import { extendType, nonNull, stringArg } from "nexus";
import { z } from "zod";

const passwdSchema = z
  .string()
  .trim()
  .min(10, "Password must be at least 10 characters")
  .max(256, "Password cannot exceed 256 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_.,-])[A-Za-z\d!@#$%^&*_.,-]{10,256}$/,
    "Password must contain a lowercase, an uppercase, a number, and a special character (!@#$%^&*_,.-)"
  );

export const UserAccountPasswdUpdateMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("userAccountPasswdUpdate", {
      type: "UserAccountPasswdUpdateResponse",
      args: {
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        try {
          const { user: authUser } = ctx;

          if (!authUser || !authUser._id || !isValidObjectId(authUser._id)) {
            throw ApiError({
              statusCode: 401,
              success: false,
              code: "UNAUTHORIZED",
              message: "Unauthorized request",
              data: null,
            });
          }

          const { password } = args;

          const result = passwdSchema.safeParse(password);
          if (!result.success) {
            const fieldError = result.error.flatten().fieldErrors;
            const firstError =
              Object.values(fieldError)[0]?.[0] || "Invalid password format";
            throw ApiError({
              statusCode: 400,
              success: false,
              code: "VALIDATION_ERROR",
              message: firstError,
              data: null,
            });
          }

          const hashPasswd = await bcrypt.hash(password, 10);

          await notifyKakfa({
            userData: {
              userId: authUser._id,
              password: hashPasswd,
            },
            action: "user-passwd-change",
          });

          return ApiResponse({
            statusCode: 200,
            success: true,
            code: "PASSWORD_UPDATED",
            message: "Password updated successfully",
            data: null,
          });
        } catch (error: any) {
          if (error instanceof GraphQLError) throw error;

          throw ApiError({
            statusCode: 500,
            success: false,
            code: "INTERNAL_ERROR",
            message: error.message || "Internal server error",
            data: null,
          });
        }
      },
    });
  },
});
