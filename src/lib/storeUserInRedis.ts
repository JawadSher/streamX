import { connectRedis } from "./redis";
import { IRedisDBUser } from "@/interfaces/IRedisDBUser";

export async function storeUserInRedis(user : IRedisDBUser) {
  if (!user || !user._id) return false;

  try {
    const redis = await connectRedis();
    const userId = user._id;

      const userData = {
        _id: userId?.toString(),
        email: user.email || "",
        userName: user.userName || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        channelName: user.channelName || "",
        isVerified: user.isVerified || false,
        watchHistory: user.watchHistory,
        watchLater: user.watchLater,
        likedVideos: user.likedVideos,
        disLikedVideos: user.disLikedVideos,
        bio: user.bio || "",
        phoneNumber: user.phoneNumber || "",
        accountStatus: user.accountStatus || "active",
        avatar: user.avatarURL || "",
        banner: user.bannerURL || "",
        createdAt: user.createdAt || "",
        updatedAt: user.updatedAt || ""
      };

    await redis.hset(`app:user:${userId}`, userData);
    await redis.expire(`app:user:${userId}`, 30 * 24 * 60 * 60);
    return true;
  } catch (error) {
    console.error("Redis storage error:", error);
    return false;
  }
}