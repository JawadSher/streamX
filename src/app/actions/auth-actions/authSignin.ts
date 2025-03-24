"use server"

import { loginSchema } from "@/schemas/loginSchema";
import { signIn } from "@/app/api/auth/[...nextauth]/configs";
import { API_ROUTES } from "@/lib/api/ApiRoutes";
import { AuthError } from "next-auth";

type AuthSigninResult = {
  success: boolean;
  errors?: { email?: string[]; password?: string[] };
  error?: string;
  redirect?: string;
  message?: string;
};

export async function authSignin(
  state: AuthSigninResult | null,
  formData: FormData
): Promise<AuthSigninResult> {
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = loginSchema.safeParse(data);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return {
      success: false,
      errors: {
        email: fieldErrors?.email,
        password: fieldErrors?.password,
      },
    };
  }

  try {
    await signIn("credentials", {
      email: result.data.email,
      password: result.data.password,
      redirect: false, 
    });

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
}

export async function authProviderSignIn() {
  await signIn("google", { callbackUrl: `${API_ROUTES.HOME}` });
}
