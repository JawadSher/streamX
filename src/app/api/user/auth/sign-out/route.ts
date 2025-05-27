import { ApiError } from "@/lib/api/ApiError";
import { connectRedis } from "@/lib/redis";
import { verifyAuth } from "@/lib/verifyAuth";
import { NextRequest, NextResponse } from "next/server";
import { signOut } from "../../../auth/[...nextauth]/configs";
import { ApiResponse } from "@/lib/api/ApiResponse";

export async function POST(request: NextRequest): Promise<NextResponse> {
  console.log("user signout called");
  try {
    const token = await verifyAuth(request);

    if (!token || !token._id) {
      return ApiError(401, "Unauthorized request", null);
    }

    const redis = await connectRedis();
    const userId = token?._id.toString();
    await redis.expire(`app:user:${userId}`, 60 * 60 * 24 * 7);
    await signOut({ redirect: false });

    return ApiResponse(200, "Logout Successfull", null);
  } catch (error: any) {
    return ApiError(400, "Something went wrong while logout", null);
  }
}
