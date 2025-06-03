import { signIn } from "@/app/api/auth/[...nextauth]/configs";
import { ApiError } from "@/lib/api/ApiError";
import { ApiResponse } from "@/lib/api/ApiResponse";
import { validateUserCredentials } from "@/lib/validateUserCredentials";
import loginSchema from "@/schemas/loginSchema";
import { extendType, nonNull, stringArg } from "nexus";

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
          if (authUser) {
            return ApiError({
              statusCode: 409,
              success: false,
              message: "User is already authenticated",
              code: "ALREADY_AUTHENTICATED",
              data: null,
            });
          }

          const { email, password } = args;
          if (!email?.trim() || !password?.trim()) {
            return ApiError({
              statusCode: 400,
              success: false,
              message: "Email & Password is required to login",
              code: "BLANK_FIELDS",
              data: null,
            });
          }

          const result = loginSchema.safeParse(args);
          if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            return ApiError({
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
            return ApiError({
              statusCode: 401,
              code: "INVALID_FIELDS",
              message: "Invalid email or password",
              data: null,
            });
          }

          await signIn("credentials", {
            email: result.data.email,
            password: result.data.password,
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
          return ApiError({
            statusCode: 500,
            success: false,
            code: "INTERNAL_ERROR",
            message: error?.message || "Internal Server Error",
            data: null,
          });
        }
      },
    });
  },
});
