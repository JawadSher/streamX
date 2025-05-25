import { ApiError } from "@/lib/api/ApiError";
import { connectDB } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import UserModel from "@/models/user.model";
import { ApiResponse } from "@/lib/api/ApiResponse";

const userNameSchema = z
  .string()
  .trim()
  .min(2, "Username must be at least 2 characters")
  .max(60, "Username cannot exceed 60 characters")
  .regex(
    /^[a-z][a-z0-9]{1,59}$/,
    "Username must start with a letter and contain only lowercase letters and numbers"
  );

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { isAuthentic, userName } = body.data;

    if (!isAuthentic) {
      return ApiError(401, "Unauthorized request", null);
    }

    const parsed = userNameSchema.safeParse(userName);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      const validationError =
        Object.values(errors).flat()[0] || "Invalid username format";
      return ApiError(422, "Validation error", { validationError });
    }

    await connectDB();

    const existingUser = await UserModel.findOne({
      userName: "@" + userName.toLowerCase(),
    });

    if (existingUser) {
      return ApiError(409, "Username is already taken", { available: false });
    }

    return ApiResponse(200, "Username is available", { available: true });
  } catch (error) {
    return ApiError(500, "Internal server error", error);
  }
}
