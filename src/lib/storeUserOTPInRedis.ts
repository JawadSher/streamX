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

    await redis.hset(`app:OTP:${userId}`, {
      verificationCode: code,
    });

    await redis.expire(`app:OTP:${userId}`, 120);
    return true;
  } catch (error) {
    console.error("Redis storage error:", error);
    return false;
  }
}
