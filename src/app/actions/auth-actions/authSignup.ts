"use server";

import { signupSchema } from "@/schemas/signupSchema";

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
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    userName: formData.get("userName"),
    email: formData.get("email"),
    password: formData.get("password"),
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
    console.log("Signup server method called")
    return { success: true };
  } catch (error) {
    return { success: false, error: "Authentication failed" };
  }
}
