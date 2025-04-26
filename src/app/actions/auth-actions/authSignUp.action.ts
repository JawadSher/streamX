"use server";

import { signupSchema } from "@/schemas/signupSchema";
import { signIn } from "@/app/api/auth/[...nextauth]/configs";
import { API_ROUTES } from "@/lib/api/ApiRoutes";
import { AuthError } from "next-auth";
import { signUpHelper } from "./signUpHelper.action";
import { ActionErrorType, ActionResponseType } from "@/lib/Types";
import { actionError } from "@/lib/actions-templates/ActionError";
import { actionResponse } from "@/lib/actions-templates/ActionResponse";

export interface IUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  userName?: string;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function authSignUp({
  firstName,
  lastName,
  email,
  password,
  userName,
}: IUserData): Promise<ActionResponseType | ActionErrorType> {
  const userData = { firstName, lastName, email, password, userName };

  console.log(userData)

  const result = signupSchema.safeParse(userData);
  if (!result.success) {
    return actionError(
      400,
      "Validation failed",
      result.error.flatten().fieldErrors
    );
  }

  try {
    const response = await signUpHelper({ userData });
    if (response.statusCode === 201) {
      await sleep(1500);
      try {
        const signinResult = await signIn("credentials", {
          email: result.data.email,
          password: result.data.password,
          redirect: false,
        });

        if (signinResult?.error) {
          return actionError(400, signinResult.error || "Login failed", {});
        }

        return actionResponse(200, "User logged in successfully", {
          redirect: API_ROUTES.HOME,
        });
      } catch (error) {
        if (error instanceof AuthError) {
          if (error.type === "CredentialsSignin") {
            return actionError(401, "Invalid email or password", {});
          }
          return actionError(500, error.message || "Authentication failed", {});
        }

        return actionError(
          500,
          "An unexpected error occurred during authentication",
          {}
        );
      }
    } else if (response.statusCode === 409) {
      return actionError(
        409,
        "An account with this email or username already exists",
        {}
      );
    } else if (response.statusCode === 400) {
      return actionError(400, "Invalid request data", {});
    }else {
      return actionError(500, "Signup failed due to unknown error", {});
    }
  } catch (error: any) {
    return actionError(500, "An unexpected error occurred", {});
  }
}
