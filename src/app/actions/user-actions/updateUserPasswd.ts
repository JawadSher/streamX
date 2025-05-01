"use server";

import { auth } from "@/app/api/auth/[...nextauth]/configs";
import { actionError } from "@/lib/actions-templates/ActionError";
import { actionResponse } from "@/lib/actions-templates/ActionResponse";
import notifyKakfa from "@/lib/notifyKafka";
import bcrypt from "bcryptjs";
import { z } from "zod";

const passwdSchema = z
  .string()
  .trim()
  .min(10, "Password must be at least 10 characters")
  .max(256, "Password cannot exceed 256 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_.,-])[A-Za-z\d!@#$%^&*_.,-]{10,256}$/,
    "Password must contain a lowercase, an uppercase, a number, and a special character (!@#$%^&*_,.-)"
  );

export async function updateUserPasswd({ passwd }: { passwd: string | null | undefined }) {
  const session = await auth();
  if (!session?.user?._id)
    return actionError(400, "Unauthorized request", null);

  if (!passwd?.trim()) return actionError(400, "Password is required", null);

  const result = passwdSchema.safeParse(passwd);
  if (!result.success) {
    return actionError(
      400,
      "Your password can't meet our password pattern conditions. Choose strong password",
      null
    );
  }

  const hashPasswd = await bcrypt.hash(result.data?.trim()?.toString()!, 10);

  try {
    await notifyKakfa({
      userData: {
        userId: session.user._id,
        password: hashPasswd,
      },  
      action: 'user-passwd-change'
    });

    return actionResponse(200, "Password Updated Successfully", null);
  } catch (error: any) {
    if (error instanceof Error) {
      return actionError(
        400,
        error.message || "Something went wrong while changing the password",
        null
      );
    }

    return actionError(400, "Unknown error occurred", null);
  }
}
