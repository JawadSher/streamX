import { ApiError } from "@/lib/api/ApiError";
import { signupSchema } from "@/schemas/signupSchema";
import { extendType, nonNull, stringArg } from "nexus";
import { connectDB } from "@/lib/database";
import User from "@/models/user.model";
import notifyKakfa from "@/lib/notifyKafka";
import bcrypt from "bcryptjs";
import { GraphqlApiResponse } from "@/lib/api/GraphqlApiResponse";
import { signIn } from "@/app/api/auth/[...nextauth]/configs";
import { validateUserCredentials } from "@/lib/validateUserCredentials";
import { GraphQLError } from "graphql";
import { getSession } from "next-auth/react";

export interface IUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  userName?: string;
}

export async function signupHelper({ userData }: { userData: IUserData }) {
  try {
    await connectDB();
    const userExists = await User.findOne({
      $or: [
        { email: userData?.email?.toLowerCase() },
        { userName: userData?.userName?.toLowerCase() },
      ],
    });

    if (userExists) {
      return {
        success: false,
        message: "Account already exist",
      };
    }

    const encryptedPassword = await bcrypt.hash(userData.password!, 10);

    const user = {
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      userName: "@" + userData?.userName?.toLowerCase(),
      email: userData?.email?.toLowerCase(),
      password: encryptedPassword,
      channelName: userData.userName,
      isVerified: false,
    };

    await notifyKakfa({ userData: user, action: "sign-up" });

    return {
      success: true,
      message: "User account created successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Internal server error",
    };
  }
}

export const UserSignupMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("signUpUser", {
      type: "UserSignupResponse",
      args: {
        firstName: nonNull(stringArg()),
        lastName: nonNull(stringArg()),
        userName: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parnt, args, _ctx) => {
        try {
          const { firstName, lastName, userName, email, password } = args;

          if (
            [firstName, lastName, userName, email, password].some(
              (field) => field?.trim().length === 0
            )
          ) {
            ApiError({
              statusCode: 400,
              success: false,
              code: "INVALID_FIELDS",
              message: "All fields are required",
              data: null,
            });
          }
          const result = signupSchema.safeParse(args);
          if (!result.success) {
            const error = result.error.flatten().fieldErrors;
            ApiError({
              statusCode: 400,
              success: false,
              code: "VALIDATION_ERROR",
              message: "Please put correct values into the fields",
              data: error,
            });
          }

          const response = await signupHelper({ userData: args });
          if (!response.success) {
            ApiError({
              statusCode: 400,
              success: false,
              message: response.message,
              code: "DUPLICATION_ERROR",
              data: null,
            });
          }

          const { success } = await validateUserCredentials(email, password);

          if (!success) {
            ApiError({
              statusCode: 401,
              success: false,
              code: "INVALID_FIELDS",
              message: "Invalid email or password",
              data: null,
            });
          }

          await signIn("credentials", {
            email: result?.data?.email,
            password: result?.data?.password,
            redirect: false,
          });

          const session = await getSession();
          console.log(session);

          return GraphqlApiResponse({
            statusCode: 201,
            success: true,
            code: "CREATION_SUCCESS",
            message: "Account created successfull",
            data: null,
          });
        } catch (error: any) {
          if (error instanceof GraphQLError) throw error;

          ApiError({
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
