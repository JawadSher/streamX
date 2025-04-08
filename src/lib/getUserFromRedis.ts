import { connectRedis } from "./redis";

export interface IUserData {
  _id?: string | null;
  userName?: string | null;
  watchHistory?: string[] | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  channelName?: string | null;
  isVerified?: boolean | null;
  accountStatus?: string | null;
  banner?: string | null;
  avatar?: string | null;
  bio?: string | null;
  phoneNumber?: string | null;
  country?: string | null;
}

const parseJSON = <T>(str: string | undefined, fallback: T): T => {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch {
    return fallback;
  }
};

export async function getUserFromRedis(userId: string): Promise<IUserData | null> {
  if (!userId) return null;

  try {
    const redis = await connectRedis();
    const userData = await redis.hgetall(`app:user:${userId}`) as Record<string, string>;
    if (!userData || Object.keys(userData).length === 0) return null;

    const user: IUserData = {
      _id: userData._id,
      userName: userData.userName,
      watchHistory: parseJSON(userData.watchHistory, []),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      accountStatus: userData.accountStatus,
      banner: userData.banner,
      avatar: userData.avatar,
      channelName: userData.channelName,
      isVerified: ["true", "1", true].includes(userData.isVerified as any), 
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
