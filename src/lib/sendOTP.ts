import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";

export async function SendVerificationCode({
  firstName,
  userEmail,
  OTP,
  expiryTime,
}: {
  userEmail: string;
  firstName: string;
  OTP: string;
  expiryTime: string;
}) {
  try {
    if (
      !userEmail ||
      !/^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        userEmail
      )
    ) {
      return {
        success: false,
        message: "Invalid format email address",
      };
    }

    console.log("--- STEP 1 ----");
    const resend_API_KEY = process.env.NEXT_RESEND_API_KEY;

    if (!resend_API_KEY) {
      return {
        success: false,
        message: "Resend email service configuration error",
      };
    }

    const resend = new Resend(resend_API_KEY);

    console.log("--- STEP 2 ----");
    const { data, error } = await resend.emails.send({
      from: "streamX <onboarding@resend.dev>",
      to: [`${userEmail}`],
      subject: "streamX Verification Code",
      react: EmailTemplate({ firstName, OTP, expiryTime }),
    });

    console.log("--- STEP 3 ----");
    if (error) {
      console.error("Email send failed:", error);
      return {
        success: false,
        message: error.message,
      };
    }

    console.log("--- STEP 4 ----");
    return {
      success: true,
      message: "OTP email send successfully",
      data: {
        OTP,
        expiryTime,
        resend: {
          ...data,
        },
      },
    };
  } catch (error: any) {
    console.log("--- STEP 5 ----");
    return {
      success: false,
      message: `Internal server error while sending OTP: ${error}`,
    };
  }
}
