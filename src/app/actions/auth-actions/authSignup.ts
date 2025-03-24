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
  const data = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    userName: formData.get("userName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = signupSchema.safeParse(data);
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return { success: false, errors: fieldErrors };
  }

  try {
    const response = await axiosInstance.post(API_ROUTES.SIGN_UP, result.data, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 201) {
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

        if (signinResult?.error) {
          return {
            success: false,
            error: signinResult.error,
          };
        }

        return {
          success: true,
          message: "User logged in successfully",
          redirect: API_ROUTES.HOME,
        };
      } catch (error) {
        console.error("Signin error:", error);

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
