"use client";

import { signOut } from "next-auth/react";
import { persistPurge } from "@/lib/persistPurge";
import { connectRedis } from "@/data-access/redisDB/redis";
import { Toaster } from "@/components/toaster";

export async function logoutHandler(
  session: any,
  setLoading?: (value: boolean) => void
) {
  try {
    setLoading?.(true);

    if (!session || !session?.user?._id) {
      await persistPurge();
      Toaster.error(
        "Session Expired",
        "You’re already logged out or your session has expired."
      );
      return true;
    }

    const redis = await connectRedis();
    const userId = session.user._id.toString();
    await redis.expire(`app:user:${userId}`, 60 * 60 * 24 * 7);

    await signOut({ redirect: false });
    await persistPurge();

    Toaster.success(
      "Logged Out Successfully",
      "You have been signed out of your account."
    );

    return true;
  } catch (error: any) {
    Toaster.error(
      "Logout Failed",
      error.message ||
        "Something went wrong while logging out. Please try again."
    );
    return false;
  } finally {
    setLoading?.(false);
  }
}
