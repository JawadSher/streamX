import { connectRedis } from "./redis";

export async function deleteUserOTPFromRedis({
  userId,
  state,
}: {
  userId: string;
  state?: string | null;
}) {
  if (!userId) return false;

  try {
    const redis = await connectRedis();

    await redis.del(`app:OTP:${userId}`);
    if (state && state === "verify") {
      await redis.hset(`app:user:${userId}`, {
        isVerified: true,
      });
    }
    return true;
  } catch (error) {
    console.error("Redis storage error:", error);
    return false;
  }
}
