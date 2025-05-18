"use server"
import { auth } from "@/app/api/auth/[...nextauth]/configs";
import { actionError } from "@/lib/actions-templates/ActionError";
import { actionResponse } from "@/lib/actions-templates/ActionResponse";
import { connectRedis } from "@/lib/redis";
import { ActionErrorType, ActionResponseType } from "@/lib/Types";

export async function getUserProfile(): Promise<
  ActionResponseType | ActionErrorType
> {
  const session = await auth();
  if (!session?.user?._id)
    return actionError(400, "Unauthorized request", null);

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
    const userId = session.user._id;
    const redis = await connectRedis();
    const userProfile = await redis.hmget(`app:user:${userId}`, ...fields);

    return actionResponse(200, "User profile fetched", userProfile);
  } catch (error: any) {
    return actionError(400, "Server error while fetching user profile", null);
  }
}
