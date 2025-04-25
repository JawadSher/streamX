"use server";

import { ApiResponse } from "@/lib/api/ApiResponse";
import notifyKakfa from "@/lib/notifyKafka";
import { userUpdateSchema } from "@/schemas/userUpdateSchema";
import { ApiError } from "@/lib/api/ApiError";
import { phoneNumberSchema } from "@/schemas/phoneNumberSchema";
import { auth } from "@/app/api/auth/[...nextauth]/configs";
import { NextResponse } from "next/server";

type UpdateUserRequestBody = {
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  country?: string | null;
};

// Explicitly type the NextResponse payload
export async function userBasicAccountUpdate({
  firstName,
  lastName,
  phoneNumber,
  country,
}: UpdateUserRequestBody): Promise<NextResponse<ApiError | ApiResponse<null>>> {
  const session = await auth();
  if (!session?.user?._id) {
    return NextResponse.json(new ApiError("Unauthorized request", 401));
  }

  try {
    const data = { firstName, lastName, country };
    const result = userUpdateSchema.safeParse(data);
    if (!result.success) {
      return NextResponse.json(new ApiError("Invalid request body", 400));
    }

    if (phoneNumber && phoneNumber?.trim().length > 0) {
      const numResult = phoneNumberSchema.safeParse(phoneNumber);
      if (!numResult.success) {
        return NextResponse.json(new ApiError("Invalid phone number", 400));
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
      return NextResponse.json(
        new ApiError("Service temporarily unavailable", 503)
      );
    }

    return NextResponse.json(new ApiResponse(200, "User updated successfully"));
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(new ApiError("Internal server error", 500));
  }
}