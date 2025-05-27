import { NextRequest, NextResponse } from "next/server";
import notifyKakfa from "@/lib/notifyKafka";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { ApiError } from "@/lib/api/ApiError";
import { ApiResponse } from "@/lib/api/ApiResponse";
import { verifyAuth } from "@/lib/verifyAuth";

const passwdSchema = z
  .string()
  .trim()
  .min(10, "Password must be at least 10 characters")
  .max(256, "Password cannot exceed 256 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_.,-])[A-Za-z\d!@#$%^&*_.,-]{10,256}$/,
    "Password must contain a lowercase, an uppercase, a number, and a special character (!@#$%^&*_,.-)"
  );

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const token = await verifyAuth(request);
    if (!token?._id || !token) {
      return ApiError(400, "Unauthorized request", null);
    }

    const body = await request.json();
    const { password: passwd } = body?.data ?? {};

    if (!passwd?.trim()) {
      return ApiError(400, "Password is required", null);
    }

    const result = passwdSchema.safeParse(passwd);
    if (!result.success) {
      return ApiError(
        400,
        "Your password can't meet our password pattern conditions. Choose a stronger password.",
        null
      );
    }

    const hashPasswd = await bcrypt.hash(result.data.trim(), 10);
    await notifyKakfa({
      userData: {
        userId: token._id,
        password: hashPasswd,
      },
      action: "user-passwd-change",
    });

    return ApiResponse(200, "Password updated successfully", null);
  } catch (error: any) {
    return ApiError(
      400,
      error.message || "Something went wrong while changing the password",
      null
    );
  }
}
