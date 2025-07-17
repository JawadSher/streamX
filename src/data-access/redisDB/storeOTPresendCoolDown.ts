import { connectRedis } from "./redis";

export async function storeOTPresendCoolDown(userId: string) {
  try {
    const coolDownTime = Date.now() + 60 * 60 * 1000;
    const expireAtSeconds = Math.floor(coolDownTime / 1000);

    const redis = await connectRedis();
    await redis.hset(`app:otp_resend_limit:${userId}`, {
      OTPResendTime: coolDownTime.toString(),
    });
    await redis.expireat(`app:otp_resend_limit:${userId}`, expireAtSeconds);

    return {
      time: new Date(coolDownTime),
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
    };
  }
}
