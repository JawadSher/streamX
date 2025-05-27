import { signIn } from "@/app/api/auth/[...nextauth]/configs";
import { ApiError } from "@/lib/api/ApiError";
import { ApiResponse } from "@/lib/api/ApiResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import loginSchema from "@/schemas/loginSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const token = await verifyAuth(request);
  if (token?._id) {
    return ApiResponse(301, "Already Logined", null);
  }

  const data = await request.json();
  const result = loginSchema.safeParse(data.data);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return ApiError(400, "Validation failed", fieldErrors);
  }

  try {
    const signInResult = await signIn("credentials", {
      email: result.data.email,
      password: result.data.password,
      redirect: false,
    });

    if (signInResult?.error) {
      return ApiError(
        401,
        signInResult?.error || "Invalid email or password",
        null
      );
    }

    return ApiResponse(200, "Login successfull", null);
  } catch (error: any) {
    return ApiError(500, "Authentication failed", { error });
  }
}
