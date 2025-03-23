"use server";

import { signupSchema } from "@/schemas/signupSchema";
import axiosInstance from "@/lib/axios";
import { isAxiosError } from "axios";
import { signIn } from "@/app/api/auth/[...nextauth]/configs";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/ApiError";
import { API_ROUTES } from "@/lib/api/ApiRoutes";

type AuthSigninResult = {
  success: boolean;
  errors?: {
    firstName?: string[];
    lastName?: string[];
    userName?: string[];
    email?: string[];
    password?: string[];
    confirmPasswd?: string[];
  };
  error?: string;
};

export async function authSignUp(
  state: AuthSigninResult | null,
  formData: FormData
): Promise<AuthSigninResult> {
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
    return {
      success: false,
      errors: fieldErrors,
    };
  }

  try {
    const response = await axiosInstance.post(API_ROUTES.SIGN_UP, result.data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 201) {
      const signInResult = await signIn("credentials", {
        email: result.data.email,
        password: result.data.password,
        redirect: false,
      });
      
      if (signInResult?.ok) {
        redirect("/");
      } else {
        redirect("/sign-in");
      }
    } else {
      throw new ApiError("Signup failed", response.status);
    }
  } catch (error) {
    console.error("Signup error:", error);
    if (isAxiosError(error) && error.response) {
      return {
        success: false,
        error: error.response.data.message || "Signup failed",
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
