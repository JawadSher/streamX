import { connectDB } from "./database";
import { fetchUserFromMongoDB } from "./fetchUserFromMongoDB";
import { connectRedis } from "./redis";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  channelName?: string;
  email: string;
  isVerified: boolean;
  bio?: string;
  country?: string;
  phoneNumber?: string;
  accountStatus?: string;
  watchHistory?: string[];
  avatarURL?: string;
  bannerURL?: string;
}

export async function getUserData(userId: string) {
  console.log("------> getUserData Function Caled <-------")

  const redis = await connectRedis();
  const cachedUser: string | null = await redis.get(`user:${userId}`);

  if (cachedUser){
    console.log("Cached User --->: ", cachedUser); 
    return JSON.parse(cachedUser)
  };

  const user = await fetchUserFromMongoDB({ userId });
  if (!user) return null;

  const userData: User = {
    ...user,
    _id: user._id.toString(),
  };

  await redis.set(`user:${userId}`, JSON.stringify(userData));
  await redis.expire(`user:${userId}`, 86400);

  return userData;
}
