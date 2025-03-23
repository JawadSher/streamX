"use server"

import { loginSchema } from "@/schemas/loginSchema";
import { signIn } from "@/app/api/auth/[...nextauth]/configs";
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
      errors: fieldErrors,
    };
  }
  
  try {
    const signInResult = await signIn("credentials", {
      redirect: false,
      email: result?.data?.email,
      password: result?.data?.password
    });

    if(!signInResult.ok){
      console.log("SignIn failed:", signInResult?.error);
      return { success: false, error: "Invalid Credentials" };
    }
    
    return { success: true, redirect: `${API_ROUTES.HOME}` };
  } catch (error) {
    console.error("Signin error:", error);
    return { success: false, error: "Authentication failed" };
  }
}

export async function authProviderSignIn(){
  await signIn("google", {redirectTo: `${API_ROUTES.HOME}`});
}
