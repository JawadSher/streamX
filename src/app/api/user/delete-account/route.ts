import notifyKakfa from "@/lib/notifyKafka";
import { ApiError } from "@/lib/api/ApiError";
import { verifyAuth } from "@/lib/verifyAuth";
import { NextRequest, NextResponse } from "next/server";
import { signOut } from "../../auth/[...nextauth]/configs";
import { connectRedis } from "@/lib/redis";
import { ROUTES } from "@/lib/api/ApiRoutes";

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const token = await verifyAuth(request);
  if (!token?._id) {
    return ApiError(401, "Unauthorized request", null);
  }

  const userId = token._id;
  try {
    await signOut({ redirect: false });
    const redis = await connectRedis();
    await redis.expire(`app:user:${userId.toString()}`, 0);
    await notifyKakfa({ userData: userId, action: "user-account-deletion" });
    return NextResponse.redirect(
      new URL(ROUTES.PAGES_ROUTES.HOME, request.url),
      {
        status: 302,
      }
    );
  } catch (error: any) {
    return ApiError(
      500,
      error.message || "Something went wrong while deleting account",
      null
    );
  }
}
