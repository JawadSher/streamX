"use server";

import { actionError } from "@/lib/actions-templates/ActionError";
import { actionResponse } from "@/lib/actions-templates/ActionResponse";
import { connectDB } from "@/lib/database";
import { deleteUserOTPFromRedis } from "@/lib/deleteUserOTPFromRedis";
import { getUserOTPFromRedis } from "@/lib/getUserOTPFromRedis";
import { storeUserOTPInRedis } from "@/lib/storeUserOTPInRedis";
import { ActionErrorType, ActionResponseType } from "@/lib/Types";
import User from "@/models/user.model";

export async function handleUserOTP({
  code,
  userId,
  state,
}: {
  code?: string;
  userId: string;
  state: "get" | "delete" | "store" | "verified";
}): Promise<ActionResponseType | ActionErrorType> {
  if (!userId) {
    return actionError(400, "Valid userId is required", null);
  }

  
  if (state === "store") {
    if (!code) {
      return actionError(400, "OTP code is required for storing", null);
    }
    
    console.log("method called ", code, userId)
    await storeUserOTPInRedis({ code, userId });
    return actionResponse(200, "User OTP stored successfully", null);
  } else if (state === "get") {
    const OTP = await getUserOTPFromRedis({ userId });

    if (!OTP) {
      return actionError(404, "OTP not found", null);
    }

    return actionResponse(200, "User OTP fetched successfully", OTP);
  } else if (state === "delete") {
    await deleteUserOTPFromRedis({ userId });
    return actionResponse(200, "User OTP deleted successfully", null);
  } else if (state === "verified") {
    await deleteUserOTPFromRedis({ userId, state: "verified" });

    await connectDB();
    await User.findByIdAndUpdate(userId, {
      $set: {
        isVerified: true,
      },
    });

    return actionResponse(200, "User verified successfull", {
      isVerifed: true,
    });
  }

  return actionError(400, "Invalid state provided", null);
}
