import { ApiError } from "@/lib/api/ApiError";
import { ApiResponse } from "@/lib/api/ApiResponse";
import { fetchUserFromMongoDB } from "@/lib/fetchUserFromMongoDB";
import { getUserFromRedis } from "@/lib/getUserFromRedis";
import { storeUserInRedis } from "@/lib/storeUserInRedis";
import { verifyAuth } from "@/lib/verifyAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const token = await verifyAuth(request);
    console.log(token);
    if (!token) {
      return ApiError(400, "Unauthorized request", null);
    }

    const userId = token._id;
    let user = await getUserFromRedis(userId!);

    if (!user) {
      user = await fetchUserFromMongoDB({ userId });
      if (user) await storeUserInRedis(user);
    }

    if (!user) {
      return ApiError(404, "User data not found", null);
    }

    return ApiResponse(200, "User data fetched successfully", {
      ...user,
      _id: user?._id?.toString(),
    });
  } catch (error: any) {
    return ApiError(400, "Something went wrong while fetching user data", null);
  }
}
