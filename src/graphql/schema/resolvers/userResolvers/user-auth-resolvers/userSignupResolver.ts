import { ApiError } from "@/lib/api/ApiError";
import { signupSchema } from "@/schemas/signupSchema";
import { extendType, nonNull, stringArg } from "nexus";
import User from "@/models/user.model";
import notifyKakfa from "@/lib/notifyKafka";
import bcrypt from "bcryptjs";
import { GraphqlApiResponse } from "@/lib/api/GraphqlApiResponse";
import { signIn } from "@/app/api/auth/[...nextauth]/configs";
import { GraphQLError } from "graphql";
import { getSession } from "next-auth/react";
import { validateUserCredentials } from "@/data-access/mongoDB/validateUserCredentials";
import { connectDB } from "@/data-access/mongoDB/database";
import { arcJetEmailValidationConf } from "@/configs/arcjet.configs";
import { getClientIP } from "@/lib/getClientIP";
import { NextRequest } from "next/server";

export interface IUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  userName?: string;
}

export async function emailValidationWithArcjet(
  req: NextRequest,
  email: string
) {
  const decision = await arcJetEmailValidationConf.protect(req, {
    requested: 1,
    fingerprint: await getClientIP(req),
    email,
  });

  if (decision.isDenied()) {
    let message = "";
    if (decision.reason.isEmail()) {
      if (decision.reason.emailTypes.includes("DISPOSABLE")) {
        message = "We do not allow disposable email addresses.";
      } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
        message =
          "Your email domain does not have an MX record. Is there a typo?";
      } else if (decision.reason.emailTypes.includes("NO_GRAVATAR")) {
        message = "We require a Gravatar profile to verify your account.";
      } else {
        message = "Invalid email address.";
      }
    }
    return {
      success: false,
      message,
    };
  }

  return {
    success: true,
    message: "Every thing is oky",
  };
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
      resolve: async (_parnt, args, ctx) => {
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

          const { req } = ctx;
          const arcjetResponse = await emailValidationWithArcjet(
            req,
            result?.data?.email!
          );
          if (!arcjetResponse.success) {
            ApiError({
              statusCode: 400,
              success: false,
              message: arcjetResponse.message,
              code: "EMAIL_VALIDATION_ERROR",
              data: null,
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
