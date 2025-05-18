import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { deleteUserOTPFromRedis } from "@/lib/deleteUserOTPFromRedis";
import { getUserOTPFromRedis } from "@/lib/getUserOTPFromRedis";
import { storeUserOTPInRedis } from "@/lib/storeUserOTPInRedis";
import User from "@/models/user.model";
import { ApiError } from "@/lib/api/ApiError";
import { verifyAuth } from "@/lib/verifyAuth";
import { ApiResponse } from "@/lib/api/ApiResponse";

interface OTPRequestBody {
  code?: string;
  state: "store" | "get" | "delete" | "verified";
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const token = await verifyAuth(request);
    if (!token || !token._id) {
      return ApiError(400, "Unauthorized request", null);
    }

    const body: OTPRequestBody = await request.json();
    const { code, state } = body;
    const userId = token._id;

    if (state === "store") {
      if (!code) {
        return ApiError(400, "OTP code is required for storing", null);
      }

      await storeUserOTPInRedis({ code, userId });
      return ApiResponse(200, "User OTP stored successfully", null);
    } else if (state === "get") {
      const data = await getUserOTPFromRedis({ userId });

      if (!data) {
        return ApiError(404, "OTP not found", null);
      }

      return ApiResponse(200, "User OTP fetched successfully", { ...data });
    } else if (state === "delete") {
      await deleteUserOTPFromRedis({ userId });
      return ApiResponse(200, "User OTP deleted successfully", null);
    } else if (state === "verified") {
      await deleteUserOTPFromRedis({ userId, state: "verified" });

      await connectDB();
      await User.findByIdAndUpdate(userId, {
        $set: { isVerified: true },
      });

      return ApiResponse(200, "User verified successfully", {
        isVerified: true,
      });
    }

    return ApiError(400, "Invalid state provided", null);
  } catch (error: any) {
    return ApiError(500, "Internal Server Error", error);
  }
}
