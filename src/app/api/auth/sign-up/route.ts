import { connectDB } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import { ApiError } from "@/lib/api/ApiError";
import { ApiResponse } from "@/lib/api/ApiResponse";
import { signupSchema } from "@/schemas/signupSchema";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const parsedData = signupSchema.safeParse(body);

    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues
        .map((issue) => issue.message)
        .join(", ");
      throw new ApiError(`Validation failed: ${errorMessages}`, 400);
    }

    const { firstName, lastName, userName, email, password } =
      parsedData.data;

    await connectDB();

    const userExists = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { userName: userName.toLowerCase() },
      ],
    });

    if (userExists) {
      throw new ApiError(
        userExists.email.toLowerCase() === email.toLowerCase()
          ? "Email already registered"
          : "Username already taken",
        409
      );
    }

    const user = await User.create({
      firstName,
      lastName,
      userName: userName.toLowerCase(),
      email: email.toLowerCase(),
      password,
      channelName: userName,
      phoneNumber: null,
      country: "None",
      isVerified: false,
      verificationCode: null,
      accountStatus: "active",
    });

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.verificationCode;

    return NextResponse.json(
      new ApiResponse(201, "User account created successfully", userResponse),
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      console.log(error);
      return NextResponse.json(error, {
        status: error.statusCode,
      });
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(new ApiError("Invalid request body", 400), {
        status: 400,
      });
    }

    console.error("Signup error:", error);
    return NextResponse.json(new ApiError("Internal server error", 500), {
      status: 500,
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },

    responseLimit: '8mb',
    timeout: 10000,
  },
};
