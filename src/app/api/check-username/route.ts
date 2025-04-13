import { connectDB } from "@/lib/database";
import UserModel from "@/models/user.model";
import { ApiError } from "@/lib/api/ApiError";
import { ApiResponse } from "@/lib/api/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userName = searchParams.get("username");

    if (!userName) {
      return NextResponse.json(
        new ApiResponse(400, "Username query parameter is required"),
        { status: 400 }
      );
    }

    await connectDB();
    const user = await UserModel.findOne({ userName });

    if (user) {
      return NextResponse.json(
        new ApiResponse(400, "Username is already taken"),
        { status: 400 }
      );
    }

    return NextResponse.json(
      new ApiResponse(200, "Username is available"),
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        new ApiError(error.message, error.statusCode),
        { status: error.statusCode }
      );
    }

    console.error("Username check error:", error);
    return NextResponse.json(
      new ApiError("Internal server error", 500),
      { status: 500 }
    );
  }
}