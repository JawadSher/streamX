import { IRedisDBUser } from "@/interfaces/IRedisDBUser";
import { connectRedis } from "./redis";

const parseJSON = <T>(str: string | undefined, fallback: T): T => {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch {
    return fallback;
  }
};

export async function getUserFromRedis(userId: string): Promise<IRedisDBUser | null> {
  if (!userId) return null;

  try {
    const redis = await connectRedis();
    const userData = await redis.hgetall(`app:user:${userId}`) as Record<string, string>;
    if (!userData || Object.keys(userData).length === 0) return null;

    const user: IRedisDBUser = {
      _id: userData._id,
      userName: userData.userName,
      watchHistory: parseJSON(userData.watchHistory, []),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      accountStatus: userData.accountStatus,
      bannerURL: userData.banner,
      avatarURL: userData.avatar,
      channelName: userData.channelName,
      isVerified: ["true", "1", true].includes(userData.isVerified), 
      bio: userData.bio,
      country: userData.country,
      phoneNumber: userData.phoneNumber,
    };

    return user;
  } catch (error) {
    console.error("Redis fetch error:", error);
    return null;
  }
}
