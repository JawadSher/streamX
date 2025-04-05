"use server";

import { signupSchema } from "@/schemas/signupSchema";
import axiosInstance from "@/lib/axios";
import { isAxiosError } from "axios";
import { signIn } from "@/app/api/auth/[...nextauth]/configs";
import { ApiError } from "@/lib/api/ApiError";
import { API_ROUTES } from "@/lib/api/ApiRoutes";
import { AuthError } from "next-auth";

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

export async function authSignUp(
  _state: AuthSignupResult | null,
  formData: FormData
): Promise<AuthSignupResult> {
  

  const userData = {
    ...formData
  };

  const result = signupSchema.safeParse(userData);
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return { success: false, errors: fieldErrors };
  }

  try {
    const response = await axiosInstance.post(API_ROUTES.SIGN_UP, result.data, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Account Creation Response : ", response);

    if (response.data.statusCode === 201) {
      console.log("------- ACCOUNT CREATED 201 --------")
      const data = {
        email: result.data.email,
        password: result.data.password,
      };

      try {
        const signinResult = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        console.log("------- Raw SignIn Result: ", signinResult);

        if (typeof signinResult === "string") {
          console.error("Unexpected signIn response: Received a string instead of an object:", signinResult);
          return {
            success: false,
            error: "Sign-in failed: Unexpected response format",
          };
        }

        if (signinResult?.error) {
          console.error("Sign-in failed with error:", signinResult.error);
          return {
            success: false,
            error: signinResult.error,
          };
        }

        if (!signinResult?.ok) {
          console.error("Sign-in did not succeed:", signinResult);
          return {
            success: false,
            error: "Sign-in failed unexpectedly",
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
    } else {
      throw new ApiError("Signup failed", response.status);
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 400) {
        return { success: false, error: "Invalid input data" };
      } else if (status === 409) {
        return { success: false, error: "Email or username already taken" };
      } else {
        return {
          success: false,
          error: error.response.data.message || "Signup failed",
        };
      }
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}
