import { connectRedis } from "./redis";

export async function storeUserInRedis(user: any) {
  if (!user || !user._id) return false;

  console.log("\nStoring User in Redis: ", user)

  try {
    const redis = await connectRedis();
    const userId =
      typeof user._id === "string" ? user._id : user._id.toString();

    const userData = {
      id: userId,
      email: user.email || "",
      userName: user.userName || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      channelName: user.channelName || "",
      isVerified: user.isVerified || false,
      watchHistory: user.watchHistory,
      bio: user.bio || "",
      phoneNumber: user.phoneNumber || "",
      accountStatus: user.accountStatus || "active",
      avatar: user.avatarURL || "",
      banner: user.bannerURL || "",
    };

    await redis.hset(`app:user:${userId}`, userData);
    await redis.expire(`app:user:${userId}`, 86400);
    return true;
  } catch (error) {
    console.error("Redis storage error:", error);
    return false;
  }
}