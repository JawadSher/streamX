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
    const fetchedUser = await fetchUserFromMongoDB({ userId });
    if (fetchedUser) {
      const plainUser = {
        _id: fetchedUser._id ? String(fetchedUser._id) : null,
        firstName: fetchedUser.firstName || null,
        lastName: fetchedUser.lastName || null,
        email: fetchedUser.email || null,
        channelName: fetchedUser.channelName || null,
        bio: fetchedUser.bio || null,
        country: fetchedUser.country || null,
        accountStatus: fetchedUser.accountStatus || null,
        isVerified: typeof fetchedUser.isVerified === "boolean" ? fetchedUser.isVerified : null,
        avatarURL: fetchedUser.avatarURL || null,
        bannerURL: fetchedUser.bannerURL || null,
        phoneNumber: fetchedUser.phoneNumber || null,
        userName: fetchedUser.userName || null,
        watchHistory: Array.isArray(fetchedUser.watchHistory)
          ? fetchedUser.watchHistory.map(String)
          : [],
      };
      await storeUserInRedis(plainUser);
      user = plainUser;
    }
  }

  if (!user) return null;
  return {
    _id: user._id ? String(user._id) : null,
    firstName: user.firstName || null,
    lastName: user.lastName || null,
    email: user.email || null,
    channelName: user.channelName || null,
    bio: user.bio || null,
    country: user.country || null,
    accountStatus: user.accountStatus || null,
    isVerified: typeof user.isVerified === "boolean" ? user.isVerified : null,
    avatarURL: user.avatarURL || null,
    bannerURL: user.bannerURL || null,
    phoneNumber: user.phoneNumber || null,
    userName: user.userName || null,
    watchHistory: Array.isArray(user.watchHistory)
      ? user.watchHistory.map(String)
      : [],
  };
});