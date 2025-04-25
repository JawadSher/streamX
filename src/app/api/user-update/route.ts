import { ApiResponse } from "@/lib/api/ApiResponse";
import notifyKakfa from "@/lib/notifyKafka";
import { userUpdateSchema } from "@/schemas/userUpdateSchema";
import { ApiError } from "@/lib/api/ApiError";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../auth/[...nextauth]/configs";
import { phoneNumberSchema } from "@/schemas/phoneNumberSchema";

type UpdateUserRequestBody = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
};

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?._id) {
    return NextResponse.json(new ApiError("Unauthorized request", 401), { status: 401 });
  }

  try {
    const body: UpdateUserRequestBody = await request.json();
    const { firstName, lastName, phoneNumber, country } = body;
    
    const data = {
      firstName,
      lastName,
      country,
    };
    
    console.log(data);
    const result = await userUpdateSchema.safeParse(data);
    if (!result.success) {
      return NextResponse.json(
        new ApiError("Invalid request body", 400),
        { status: 400 }
      );
    }

    if(phoneNumber.length > 0){
      const numResult = await phoneNumberSchema.safeParse(phoneNumber);
      if(!numResult.success){
        return NextResponse.json(
          new ApiError(result.error || "Phone number error", 400),
          { status: 400 }
        );
    }
    }

    const userData = {
      ...data,
      userId: session.user._id,
      phoneNumber: phoneNumber
    }

    try {
      await notifyKakfa({ userData, action: "user-update" });
    } catch (kafkaError) {
      console.error("Kafka error:", kafkaError);
      return NextResponse.json(new ApiError( "Service temporarily unavailable", 503), {
        status: 503,
      });
    }

    return NextResponse.json(new ApiResponse(200, "User updated successfully"));
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(new ApiError("Invalid JSON format", 400), { status: 400 });
    }
    console.error("Server error:", error);
    return NextResponse.json(new ApiError("Internal server error", 500), { status: 500 });
  }
}
