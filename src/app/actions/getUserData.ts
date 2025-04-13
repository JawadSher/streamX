
"use server";

import { auth } from "@/app/api/auth/[...nextauth]/configs";
import { getUserFromRedis } from "@/lib/getUserFromRedis";
import { fetchUserFromMongoDB } from "@/lib/fetchUserFromMongoDB";
import { cache } from "react";
import { storeUserInRedis } from "@/lib/storeUserInRedis";
import { IRedisDBUser } from "@/interfaces/IRedisDBUser";

export const getUserData = cache(async (): Promise<IRedisDBUser | null> => {
  const session = await auth();
  const userId = session?.user?._id;

  if (!userId) return null;
  let user = await getUserFromRedis(userId);

  if (!user) {
    user = await fetchUserFromMongoDB({ userId });
    if (user) await storeUserInRedis(user);
  }

  return {
    ...user,
    watchHistory: user?.watchHistory ?? [],
  };
});
