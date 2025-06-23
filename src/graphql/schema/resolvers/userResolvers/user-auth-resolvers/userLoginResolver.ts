import { signIn } from "@/app/api/auth/[...nextauth]/configs";
import { ApiError } from "@/lib/api/ApiError";
import { ApiResponse } from "@/lib/api/ApiResponse";
import { validateUserCredentials } from "@/lib/validateUserCredentials";
import loginSchema from "@/schemas/loginSchema";
import { GraphQLError } from "graphql";
import { extendType, nonNull, stringArg } from "nexus";
import mongoose from "mongoose";

export const UserLoginMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("loginUser", {
      type: "UserLoginResponse",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parnt, args, ctx) => {
        try {
          const { user: authUser } = ctx;
          if (
            authUser !== null &&
            authUser._id &&
            mongoose.isValidObjectId(authUser._id)
          ) {
            ApiError({
              statusCode: 409,
              success: false,
              message: "User is already authenticated",
              code: "ALREADY_AUTHENTICATED",
              data: null,
            });
          }

          const { email, password } = args;
          if (!email?.trim() || !password?.trim()) {
            ApiError({
              statusCode: 400,
              success: false,
              message: "Email & Password is required to login",
              code: "BLANK_FIELDS",
              data: null,
            });
          }

          const result = loginSchema.safeParse({
            email: args.email,
            password: args.password,
          });

          if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            ApiError({
              statusCode: 400,
              success: false,
              code: "VALIDATION_ERROR",
              message: "Validation failed",
              data: {
                fieldErrors,
              },
            });
          }

          const { success } = await validateUserCredentials(email, password);
          if (!success) {
            ApiError({
              statusCode: 400,
              code: "INVALID_FIELDS",
              success: false,
              message: "Invalid email or password",
              data: null,
            });
          }

          await signIn("credentials", {
            email: result?.data?.email,
            password: result?.data?.password,
            redirect: false,
          });

          return ApiResponse({
            statusCode: 200,
            success: true,
            code: "LOGIN_SUCCESS",
            message: "Login Successfull",
            data: null,
          });
        } catch (error: any) {
          if (error instanceof GraphQLError) throw error;

          ApiError({
            statusCode: 500,
            success: false,
            code: "INTERNAL_ERROR",
            message: "Internal Server Error",
            data: null,
          });
        }
      },
    });
  },
});
