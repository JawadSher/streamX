"use server";

import notifyKakfa from "@/lib/notifyKafka";
import { userUpdateSchema } from "@/schemas/userUpdateSchema";
import { phoneNumberSchema } from "@/schemas/phoneNumberSchema";
import { auth } from "@/app/api/auth/[...nextauth]/configs";
import { ActionErrorType, ActionResponseType } from "@/lib/Types";
import { actionError } from "@/lib/actions-templates/ActionError";
import { actionResponse } from "@/lib/actions-templates/ActionResponse";

type UpdateUserRequestBody = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
};

export async function userBasicAccountUpdate({
  firstName,
  lastName,
  country,
  phoneNumber,
}: UpdateUserRequestBody): Promise<ActionResponseType | ActionErrorType> {
  const session = await auth();
  if (!session?.user?._id) {
    return actionError(401, "Unauthorized request", null);
  }

  try {
    const data = { firstName, lastName, country };

    const result = await userUpdateSchema.safeParse(data);
    if (!result.success) {
      return actionError(400, "Invalid request body", null);
    }

    if (phoneNumber.length > 0) {
      const numResult = await phoneNumberSchema.safeParse(phoneNumber);
      if (!numResult.success) {
        return actionError(400, result.error || "Phone number error", null);
      }
    }

    const userData = {
      ...data,
      userId: session.user._id,
      phoneNumber,
    };

    try {
      await notifyKakfa({ userData, action: "user-update" });
    } catch (kafkaError) {
      console.error("Kafka error:", kafkaError);
      return actionError(503, "Service temporarily unavailable", 503);
    }

    return actionResponse(200, "User updated successfully", null);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return actionError(400, "Invalid JSON format", null);
    }
    return actionError(500, "Internal server error", null);
  }
}
