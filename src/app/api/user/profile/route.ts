import { NextRequest, NextResponse } from "next/server";
import { connectRedis } from "@/lib/redis";
import { verifyAuth } from "@/lib/verifyAuth";
import { ApiError } from "@/lib/api/ApiError";
import { ApiResponse } from "@/lib/api/ApiResponse";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const token = await verifyAuth(request);
  if (!token || !token._id) {
    return ApiError(400, "Unauthorized request", null);
  }

  const fields = [
    "firstName",
    "lastName",
    "userName",
    "watchHistory",
    "watchLater",
    "likedVideos",
    "disLikedVideos",
    "avatar",
  ];

  try {
    const userId = token._id;
    const redis = await connectRedis();
    const userProfile = await redis.hmget(`app:user:${userId}`, ...fields);

    return ApiResponse(200, "User profile fetched", userProfile);
  } catch (error: any) {
    return ApiError(400, "Server error while fetching user profile", null);
  }
}
