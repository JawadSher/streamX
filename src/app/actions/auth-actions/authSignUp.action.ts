"use server";

import { signupSchema } from "@/schemas/signupSchema";
import { signIn } from "@/app/api/auth/[...nextauth]/configs";
import { API_ROUTES } from "@/lib/api/ApiRoutes";
import { AuthError } from "next-auth";
import { signUpHelper } from "./signUpHelper.action";

type AuthSignupResult = {
  success: boolean;
  errors?: {
    firstName?: string[];
    lastName?: string[];
    userName?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string;
  redirect?: string;
  error?: string;
};

interface IUserData {
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
}: IUserData): Promise<AuthSignupResult> {
  const userData = { firstName, lastName, email, password, userName };

  const result = signupSchema.safeParse(userData);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
      message: "Validation failed",
    };
  }

  try {
    const response = await signUpHelper({ userData });
    if (response.status === 201) {
      await sleep(1500);
      try {
        const signinResult = await signIn("credentials", {
          email: result.data.email,
          password: result.data.password,
          redirect: false,
        });

        if (signinResult?.error) {
          return {
            success: false,
            error: signinResult.error || "Login failed",
          };
        }

        return {
          success: true,
          message: "User logged in successfully",
          redirect: API_ROUTES.HOME,
        };
      } catch (error) {
        if (error instanceof AuthError) {
          if (error.type === "CredentialsSignin") {
            return {
              success: false,
              error: "Invalid email or password",
            };
          }
          return {
            success: false,
            error: error.message || "Authentication failed",
          };
        }

        return {
          success: false,
          error: "An unexpected error occurred during authentication",
        };
      }
    } else if (response.status === 301) {
      return {
        success: false,
        error: "An account with this email or username already exists",
      };
    } else if (response.status === 400) {
      return {
        success: false,
        error: "Invalid request data",
      };
    }

    return {
      success: false,
      error: "Signup failed due to unknown error",
    };
  } catch (error: any) {
    console.error("Signup error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
