"use server"

import { loginSchema } from "@/schemas/loginSchema";
import { signIn, signOut } from "@/app/api/auth/[...nextauth]/configs";
import { API_ROUTES } from "@/lib/api/ApiRoutes";

type AuthSigninResult = {
  success: boolean;
  errors?: { email?: string[]; password?: string[] };
  error?: string;
  redirect?: string;
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
        password: fieldErrors?.password
      },
    };
  }

  try {
    const signInResult = await signIn("credentials", {
      email: result.data.email,
      password: result.data.password,
      redirect: false,
    });

    if (signInResult?.ok) {
      return { 
        success: true, 
        redirect: API_ROUTES.HOME 
      };
    }
    return { 
      success: false, 
      error: signInResult?.error || "Invalid email or password", 
    }
  } catch (error) {
    console.error("Signin error:", error);
    return { success: false, error: "Authentication failed" };
  }
}

export async function authProviderSignIn() {
  await signIn("google", { callbackUrl: `${API_ROUTES.HOME}` });
}
