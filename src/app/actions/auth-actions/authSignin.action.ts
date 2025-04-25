"use server"

import { loginSchema } from "@/schemas/loginSchema";
import { signIn, signOut } from "@/app/api/auth/[...nextauth]/configs";
import { API_ROUTES } from "@/lib/api/ApiRoutes";
import { redirect } from "next/navigation";

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

  await signOut({ redirect: false });

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = loginSchema.safeParse(data);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return {
      success: false,
      errors: fieldErrors,
    };
  }

  try {
    console.log("Attempting to sign in with credentials:", result.data);
    
    const signInResult = await signIn("credentials", {
      email: result.data.email,
      password: result.data.password,
      redirect: false,
    });

    if (typeof signInResult === 'string') {
      return { 
        success: true, 
        redirect: API_ROUTES.HOME 
      };
    }

    if (signInResult?.ok) {
      redirect(API_ROUTES.HOME)
    }else{
      return { 
        success: false, 
        error: signInResult?.error || "Invalid email or password" 
      };
    }
  } catch (error) {
    return { success: false, error: "Authentication failed" };
  }
}

export async function authProviderSignIn() {
  await signIn("google", { redirectTo: `${API_ROUTES.HOME}` });
}
