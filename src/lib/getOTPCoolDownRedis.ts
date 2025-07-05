import { connectRedis } from "./redis";

export async function getOTPCoolDown(userId: string) {
  try {
    const redis = await connectRedis();
    const coolDownTime = await redis.hget(
      `app:otp_resend_limit:${userId}`,
      "OTPResendTime"
    );
    if (!coolDownTime) {
      return {
        success: true,
        coolDownTime: null,
      };
    }

    return {
      success: true,
      coolDownTime,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
    };
  }
}
