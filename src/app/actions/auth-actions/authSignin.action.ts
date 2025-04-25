"use server";

import { loginSchema } from "@/schemas/loginSchema";
import { signIn, signOut } from "@/app/api/auth/[...nextauth]/configs";
import { API_ROUTES } from "@/lib/api/ApiRoutes";
import { actionError } from "@/lib/actions-templates/ActionError";
import { actionResponse } from "@/lib/actions-templates/ActionResponse";
import { ActionErrorType, ActionResponseType } from "@/lib/Types";

type AuthSigninResult = {
  success: boolean;
  errors?: { email?: string[]; password?: string[] };
  error?: string;
  redirect?: string;
};

export async function authSignin(
  state: AuthSigninResult | null,
  formData: FormData
): Promise<ActionResponseType | ActionErrorType> {

  await signOut({ redirect: false });

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = loginSchema.safeParse(data);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return actionError(400, "Validation failed", fieldErrors);
  }

  try {
    const signInResult = await signIn("credentials", {
      email: result.data.email,
      password: result.data.password,
      redirect: false,
    });

    if (typeof signInResult === 'string') {
      return actionResponse(200, "Sign-in successful", { redirect: API_ROUTES.HOME });
    }

    if (signInResult?.ok) {
      return actionResponse(200, "Sign-in successful", { redirect: API_ROUTES.HOME }); 
    } else {
      return actionError(401, signInResult?.error || "Invalid email or password", {});
    }
  } catch (error) {
    return actionError(500, "Authentication failed", {}); 
  }
}

export async function authProviderSignIn() {
  await signIn("google", { redirectTo: `${API_ROUTES.HOME}` });
}
