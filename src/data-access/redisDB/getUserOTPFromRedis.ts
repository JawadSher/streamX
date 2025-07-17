import { connectRedis } from "./redis";

export async function getUserOTPFromRedis({
  userId,
}: {
  userId: string;
}) {
  if (!userId) return null;

  try {
    const redis = await connectRedis();
    return await redis.hget(`app:OTP:${userId}`, "verificationCode");
  } catch (error) {
    console.error("Redis storage error:", error);
    return null;
  }
}
