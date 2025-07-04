"use server";

import { auth, signOut } from "@/app/api/auth/[...nextauth]/configs";
import { actionError } from "@/lib/actions-templates/ActionError";
import { actionResponse } from "@/lib/actions-templates/ActionResponse";
import { ROUTES } from "@/constants/ApiRoutes";
import { connectRedis } from "@/lib/redis";
import { ActionErrorType, ActionResponseType } from "@/lib/Types";
import { redirect } from "next/navigation";

export async function authSignOut(): Promise<
  ActionResponseType | ActionErrorType
> {
  const session = await auth();

  if (!session || !session.user?._id) {
    return actionError(401, "Unauthorized request", null);
  }

  try {
    const redis = await connectRedis();
    const userId = session?.user?._id.toString();
    await redis.expire(`app:user:${userId}`, 60 * 60 * 24 * 7);
  } catch (error) {
    return actionError(400, "Redis deletion session operation failed", {
      error,
    });
  }

  await signOut({ redirect: false });
  redirect(ROUTES.PAGES_ROUTES.SIGN_IN);
  return actionResponse(200, "Logout successfull", {
    data: ROUTES.PAGES_ROUTES.SIGN_IN,
  });
}
