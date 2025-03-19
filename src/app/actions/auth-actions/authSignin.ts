"use server";

import { loginSchema } from "@/schemas/loginSchema";

type AuthSigninResult = {
  success: boolean;
  errors?: { email?: string[]; password?: string[] };
  error?: string;
};

export async function authSignin(
  state: AuthSigninResult | null,
  formData: FormData
): Promise<AuthSigninResult> {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
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
    
    

    return { success: true };
  } catch (error) {
    return { success: false, error: "Authentication failed" };
  }
}
