"use server";

import { auth, signOut } from "@/app/api/auth/[...nextauth]/configs";
import { ActionError, actionError } from "@/lib/actions-templates/ActionError";
import { ActionResponse } from "@/lib/actions-templates/ActionResponse";
import { API_ROUTES } from "@/lib/api/ApiRoutes";
import { connectRedis } from "@/lib/redis";
import { redirect } from "next/navigation";

export async function authSignOut(): Promise<ActionResponse | ActionError> {
  const session = await auth();

  if (!session || !session.user?._id) {
    return actionError(401, "Unauthorized request", null);
  }

  try {
    const redis = await connectRedis();
    const userId = session?.user?._id.toString();
    const deleted = await redis.del(`app:user:${userId}`);
    if (deleted === 0) {
      await redis.expire(`app:user:${userId}`, 0);
    }
  } catch (error) {
    return actionError(400, "Redis deletion session operation failed", null);
  }

  await signOut({ redirect: false });
  redirect(API_ROUTES.SIGN_IN);
}
