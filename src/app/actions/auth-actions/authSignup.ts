"use server";

import { connectDB } from "@/lib/database";
import { signupSchema } from "@/schemas/signupSchema";
import axios from "axios";
import { signIn } from "@/app/api/auth/[...nextauth]/configs";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/ApiError";

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

export async function authSignin(
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
    connectDB();
    const response = await axios.post("/api/auth/sign-up", result.data, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    
    if(response.status === 200){
      const signInResult = await signIn("credentials", {
        email: result.data.email,
        password: result.data.password,
        redirect: false,
      })
  
      if (signInResult?.ok) {
        redirect("/");
      } else {
        redirect("/sign-in");
      }

    }else{
      throw new ApiError("Signup failed", response.status);
    }

  } catch (error) {
    console.error("Signup error:", error);

    if (axios.isAxiosError(error) && error.response) {
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

