import { connectRedis } from "./redis";

export async function removeOTPCoolDown(userId: string) {
  try {
    const redis = await connectRedis();
    await redis.del(`app:otp_resend_limit:${userId}`);

    return {
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
    };
  }
}
