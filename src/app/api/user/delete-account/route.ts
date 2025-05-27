import notifyKakfa from "@/lib/notifyKafka";
import { ApiError } from "@/lib/api/ApiError";
import { verifyAuth } from "@/lib/verifyAuth";
import { NextRequest, NextResponse } from "next/server";
import { signOut } from "../../auth/[...nextauth]/configs";
import { connectRedis } from "@/lib/redis";
import { ApiResponse } from "@/lib/api/ApiResponse";

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const token = await verifyAuth(request);
  if (!token?._id) {
    return ApiError(401, "Unauthorized request", null);
  }

  const userId = token._id;
  try {
    const redis = await connectRedis();
    await redis.del(`app:user:${userId.toString()}`);
    await notifyKakfa({ userData: userId, action: "user-account-deletion" });
    await signOut({ redirect: false });
    return ApiResponse(200, "Your account will be deleted next 24 hrs.", null);
  } catch (error: any) {
    console.log(error);
    return ApiError(
      500,
      error.message || "Something went wrong while deleting account",
      null
    );
  }
}
