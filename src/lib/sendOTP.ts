"use client";

import { actionError } from "@/lib/actions-templates/ActionError";
import { actionResponse } from "@/lib/actions-templates/ActionResponse";
import { generateOTP } from "@/lib/generateOTP";
import emailjs from "@emailjs/browser";

export async function SendVerificationCode({
  userEmail,
}: {
  userEmail: string;
}) {
  try {
    if (
      !userEmail ||
      !/^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        userEmail
      )
    ) {
      return actionError(400, "Invalid email address", null);
    }

    const serviceId: string = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
    const templateId: string = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
    const pubKey: string = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

    if (!serviceId || !templateId || !pubKey) {
      return actionError(500, "Email service configuration error", null);
    }

    const { OTP, expiryTime } = await generateOTP();

    const templateParams = {
      email: userEmail,
      passcode: OTP,
      time: expiryTime,
    };

    const response = await emailjs.send(serviceId, templateId, templateParams, {
      publicKey: pubKey,
    });

    if (response.status !== 200) {
      console.error("EmailJS send failed:", response.text);
      return actionError(400, `Failed to send OTP: ${response.text}`, null);
    }

    return actionResponse(200, "OTP email sent successfully", {
      OTP,
      expiryTime,
    });
  } catch (error: any) {
    return actionError(
      500,
      `Internal server error while sending OTP: ${
        error.message || "Unknown error"
      }`,
      null
    );
  }
}
