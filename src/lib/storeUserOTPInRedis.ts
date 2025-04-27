import { connectRedis } from "./redis";

export async function storeUserOTPInRedis({
  code,
  userId,
}: {
  code: string;
  userId: string;
}) {
  if (!userId) return false;

  try {
    const redis = await connectRedis();

    await redis.hset(`user:otp:${userId}`, {
      pin: code,
    });

    await redis.expire(`user:otp:${userId}`, 120);
    return true;
  } catch (error) {
    console.error("Redis storage error:", error);
    return false;
  }
}
