"use client";

import { signOut } from "next-auth/react";
import { persistPurge } from "@/lib/persistPurge";
import { toast } from "sonner";
import { connectRedis } from "@/lib/redis";

export async function logoutHandler(
  session: any,
  setLoading?: (value: boolean) => void
) {
  try {
    setLoading?.(true);

    if (!session || !session?.user?._id) {
      await persistPurge();
      toast.error("User already logged out", {
        duration: 3000,
      });
      return true;
    }

    const redis = await connectRedis();
    const userId = session.user._id.toString();
    await redis.expire(`app:user:${userId}`, 60 * 60 * 24 * 7);

    await signOut({ redirect: false });
    await persistPurge();

    toast.success("User logout successfully", {
      duration: 3000,
    });

    return true;
  } catch (error: any) {
    toast.error(error.message || "Logout failed", {
      duration: 3000,
    });
    return false;
  } finally {
    setLoading?.(false);
  }
}
