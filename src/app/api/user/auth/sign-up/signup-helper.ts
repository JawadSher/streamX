import { connectDB } from "@/lib/database";
import User from "@/models/user.model";
import notifyKakfa from "@/lib/notifyKafka";
import bcrypt from "bcryptjs";
import { IUserData } from "./route";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/lib/api/ApiResponse";
import { ApiError } from "@/lib/api/ApiError";

export async function signupHelper({
  userData,
}: {
  userData: IUserData;
}): Promise<NextResponse> {
  try {
    await connectDB();

    const userExists = await User.findOne({
      $or: [
        { email: userData?.email?.toLowerCase() },
        { userName: userData?.userName?.toLowerCase() },
      ],
    });

    if (userExists) {
      return ApiError(409, "Account already exists", null);
    }

    if (!userData?.password) {
      return ApiError(400, "Password is required", {});
    }

    const encryptedPassword = await bcrypt.hash(userData.password!, 10);

    const user = {
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      userName: "@" + userData?.userName?.toLowerCase(),
      email: userData?.email?.toLowerCase(),
      password: encryptedPassword,
      channelName: userData.userName,
      isVerified: false,
    };

    await notifyKakfa({ userData: user, action: "sign-up" });

    const userWithoutPassword = {
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
      channelName: user.channelName,
      isVerified: user.isVerified,
    };

    return ApiResponse(
      201,
      "User account created successfully",
      userWithoutPassword
    );
  } catch (error: any) {
    return ApiError(500, "Internal server error", { error });
  }
}
