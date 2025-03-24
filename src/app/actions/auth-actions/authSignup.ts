"use server"

import { signupSchema } from "@/schemas/signupSchema";
import axiosInstance from "@/lib/axios";
import { isAxiosError } from "axios";
import { signIn } from "@/app/api/auth/[...nextauth]/configs";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/ApiError";
import { API_ROUTES } from "@/lib/api/ApiRoutes";

type AuthSignupResult = {
  success: boolean;
  errors?: {
    firstName?: string[];
    lastName?: string[];
    userName?: string[];
    email?: string[];
    password?: string[];
  };
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
      const signInResult = await signIn("credentials", {
        email: result.data.email,
        password: result.data.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        redirect(API_ROUTES.HOME);
      } else {
        return { success: false, error: "Failed to sign in after signup" };
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
        return { success: false, error: error.response.data.message || "Signup failed" };
      }
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}