import { connectDB } from "./database";
import { connectRedis } from "./redis";
import UserModel from "@/models/user.model";

export async function getUserData(userId: string) {
  const redis = await connectRedis();
  const cachedUser: string | null = await redis.get(`user:${userId}`);

  if (cachedUser){
    console.log("Cached User --->: ", cachedUser); 
    return JSON.parse(cachedUser)
  };

  await connectDB();
  const user = await UserModel.findById(userId);

  if (!user) return null;

  const userData = {
    _id: user._id.toString(),
    email: user.email,
    userName: user.userName,
    firstName: user.firstName,
    lastName: user.lastName,
    channelName: user.channelName,
    bio: user.bio,
    watchHistory: user.watchHistory,
  };

  await redis.set(`user:${userId}`, JSON.stringify(userData));
  await redis.expire(`user:${userId}`, 86400);

  return userData;
}
