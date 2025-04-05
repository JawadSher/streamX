import { IUser } from "@/app/(media)/layout";
import { connectRedis } from "./redis";

export async function getUserFromRedis(userId: string): Promise<IUser | null> {
  if (!userId) return null;

  try {
    const redis = await connectRedis();
    const userData = await redis.hgetall(`app:user:${userId}`) as Record<string, string>;

    if (!userData || Object.keys(userData).length === 0) {
      return null;
    }

    const user: IUser = {
      _id: userData._id,
      userName: userData.userName,
      watchHistory: JSON.parse(userData.watchHistory || "[]"),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      accountStatus: userData.accountStatus,
      banner: userData.banner,
      avatar: userData.avatar,
      channelName: userData.channelName,
      isVerified: userData.isVerified === "true",
      bio: userData.bio,
    };

    return user;
  } catch (error) {
    console.error("Redis fetch error:", error);
    return null;
  }
}
