import { NextRequest, NextResponse } from "next/server";
import notifyKakfa from "@/lib/notifyKafka";
import { userUpdateSchema } from "@/schemas/userUpdateSchema";
import { phoneNumberSchema } from "@/schemas/phoneNumberSchema";
import { ApiError } from "@/lib/api/ApiError";
import { ApiResponse } from "@/lib/api/ApiResponse";
import { verifyAuth } from "@/lib/verifyAuth";

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const token = await verifyAuth(request);
  if (!token?._id) {
    return ApiError(401, "Unauthorized request", null);
  }

  try {
    const body = await request.json();
    const { firstName, lastName, country, phoneNumber } = body.data;
    const data = { firstName, lastName, country };

    const result = userUpdateSchema.safeParse(data);
    if (!result.success) {
      return ApiError(400, "Invalid request body", null);
    }

    if (phoneNumber && phoneNumber.length > 0) {
      const numResult = phoneNumberSchema.safeParse(phoneNumber);
      if (!numResult.success) {
        return ApiError(400, "Invalid phone number format", null);
      }
    }

    const userData = {
      ...data,
      userId: token._id,
      phoneNumber,
    };

    await notifyKakfa({ userData, action: "user-update" });

    return ApiResponse(200, "User updated successfully", null);
  } catch (error: any) {
    return ApiError(400, "Invalid JSON format", null);
  }
}
