import { ApiError } from "@/lib/api/ApiError";
import { signupSchema } from "@/schemas/signupSchema";
import { NextRequest, NextResponse } from "next/server";
import { signupHelper } from "./signup-helper";
import { signIn } from "@/app/api/auth/[...nextauth]/configs";
import { ROUTES } from "@/lib/api/ApiRoutes";
import { AuthError } from "next-auth";

export interface IUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  userName?: string;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const data = await request.formData();
  const formDataObj = Object.fromEntries(data.entries());

  const result = signupSchema.safeParse(formDataObj);
  if (!result.success) {
    return ApiError(
      400,
      "Validation failed",
      result.error.flatten().fieldErrors
    );
  }

  const userData = {
    firstName: result.data.firstName,
    lastName: result.data.lastName,
    userName: result.data.userName,
    email: result.data.email,
    password: result.data.password,
  };

  const response = await signupHelper({ userData });
  if (response.status === 201) {
    await sleep(1500);
    try {
      const signinResult = await signIn("credentials", {
        email: result.data.email,
        password: result.data.password,
        redirect: false,
      });

      if (signinResult?.error) {
        return ApiError(400, signinResult.error || "Login failed", null);
      }

      return NextResponse.redirect(new URL(ROUTES.PAGES_ROUTES.HOME), {
        status: 301,
      });
    } catch (error: any) {
      if (error instanceof AuthError) {
        if (error.type === "CredentialsSignin") {
          return ApiError(401, "Invalid email or password", null);
        }
        return ApiError(500, error.message || "Authentication failed", null);
      }

      return ApiError(
        500,
        "An unexpected error occurred during authentication",
        null
      );
    }
  } else if (response.status === 409) {
    return ApiError(
      409,
      "An account with this email or username already exists",
      null
    );
  } else if (response.status === 400) {
    return ApiError(400, "Invalid request data", null);
  } else {
    return ApiError(500, "Signup failed due to unknown error", null);
  }
}
