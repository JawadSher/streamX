import { ApiError } from "@/lib/api/ApiError";
import { signupSchema } from "@/schemas/signupSchema";
import { NextRequest, NextResponse } from "next/server";
import { signupHelper } from "./signup-helper";
import { signIn } from "@/app/api/auth/[...nextauth]/configs";
import { ApiResponse } from "@/lib/api/ApiResponse";

export interface IUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  userName?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const data = await request.json();
    const result = signupSchema.safeParse(data.data);
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
    if (response.status === 409) {
      return ApiError(
        409,
        "An account with this email or username already exists",
        null
      );
    } else if (response.status === 400) {
      return ApiError(400, "Invalid request data", null);
    }

    const signinResult = await signIn("credentials", {
      email: result.data.email,
      password: result.data.password,
      redirect: false,
    });

    if (signinResult?.error) {
      return ApiError(400, "Invalid email or password", null);
    }

    return ApiResponse(201, "Account Created Successfully", null);
  } catch (error: any) {
    console.log(error);
    return ApiError(500, "Signup failed due to unknown error", error);
  }
}
