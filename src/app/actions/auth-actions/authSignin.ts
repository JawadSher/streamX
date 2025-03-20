"use server";
import { loginSchema } from "@/schemas/loginSchema";
import { signIn } from "@/app/api/auth/[...nextauth]/configs";
import { connectDB } from "@/lib/database";

type AuthSigninResult = {
  success: boolean;
  errors?: { email?: string[]; userName?: string[]; password?: string[] };
  error?: string;
};

export async function authSignin(
  state: AuthSigninResult | null,
  formData: FormData
): Promise<AuthSigninResult> {
  const data = {
    userName: formData.get("userName") as string,
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
    await connectDB();
    const signInResult = await signIn("credentials", {
      redirect: false,
      email: data.email,
      userName: data.userName,
      password: data.password
    });

    if(!signInResult.ok){
      return { success: false, error: "Authentication failed" };
    }

    return { success: true };
  } catch (error) {
    console.error("Signin error:", error);
    return { success: false, error: "Authentication failed" };
  }
}

export async function authProviderSignIn(){
  await connectDB();
  await signIn("google", {redirectTo: "/"});
}
