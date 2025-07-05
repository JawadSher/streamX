import { ApiError } from "@/lib/api/ApiError";
import { connectDB } from "@/lib/database";
import { booleanArg, extendType, stringArg } from "nexus";
import UserModel from "@/models/user.model";
import { z } from "zod";
import { GraphqlApiResponse } from "@/lib/api/GraphqlApiResponse";
import { GraphQLError } from "graphql";

const userNameSchema = z
  .string()
  .trim()
  .min(2, "Username must be at least 2 characters")
  .max(60, "Username cannot exceed 60 characters")
  .regex(
    /^[a-z][a-z0-9]{1,59}$/,
    "Username must start with a letter and contain only lowercase letters and numbers"
  );

export const UserNameCheckQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field("checkUserName", {
      type: "UserNameCheckResponse",
      args: {
        userName: stringArg(),
        isAuthentic: booleanArg(),
      },
      resolve: async (_parnt, args, _) => {
        try {
          const { userName, isAuthentic } = args;
          if (!isAuthentic) {
            ApiError({
              statusCode: 400,
              message: "Unauthorized request",
              success: false,
              code: "UNAUTHORIZED",
              data: null,
            });
          }

          const parsed = userNameSchema.safeParse(userName);
          if (!parsed.success) {
            const errors = parsed.error.flatten().formErrors[0];
            const validationError =
              errors ||
              "Username must start with a letter and contain only lowercase letters and numbers";

            ApiError({
              statusCode: 422,
              message: "Validation error",
              success: false,
              code: "VALIDATION_ERROR",
              data: {
                available: false,
                validationError
               },
            });
          }

          await connectDB();
          const existingUser = await UserModel.findOne({
            userName: "@" + userName.toLowerCase(),
          });

          if (existingUser) {
            ApiError({
              statusCode: 409,
              success: false,
              message: "Username is already taken",
              code: "USERNAME_TAKENED",
              data: {
                available: false,
              },
            });
          }

          return GraphqlApiResponse({
            statusCode: 200,
            success: true,
            message: "Username is available",
            code: "USERNAME_AVAILABLE",
            data: {
              available: true,
            },
          });
        } catch (error: any) {
          if (error instanceof GraphQLError) throw error;
          ApiError({
            statusCode: 500,
            success: false,
            message: "Internal server error",
            code: "INTERNAL_ERROR",
            data: error,
          });
        }
      },
    });
  },
});
