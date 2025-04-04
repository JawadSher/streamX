import { connectRedis } from "./redis";

export async function getUserFromRedis(userId: string) {
  if (!userId) return null;

  try {
    const redis = await connectRedis();
    const userData = await redis.hgetall(`app:user:${userId}`);
    return userData && Object.keys(userData).length > 0 ? userData : null;
  } catch (error) {
    console.error("Redis fetch error:", error);
    return null;
  }
}