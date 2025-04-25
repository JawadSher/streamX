import { connectDB } from "@/lib/database";
import User from "@/models/user.model";
import notifyKakfa from "@/lib/notifyKafka";
import bcrypt from "bcryptjs";

interface IUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  userName?: string;
}

export async function signUpHelper({
  userData,
}: {
  userData: IUserData;
}): Promise<{
  message: string;
  data?: Record<string, any>;
  status: number;
}> {
  try {
    await connectDB();

    const userExists = await User.findOne({
      $or: [
        { email: userData?.email?.toLowerCase() },
        { userName: userData?.userName?.toLowerCase() },
      ],
    });

    if (userExists) {
      return {
        message: "Account already exists",
        status: 409,
      };
    }

    const encryptedPassword = await bcrypt.hash(userData?.password!, 10);

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

    return {
      message: "User account created successfully",
      data: userWithoutPassword,
      status: 201,
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return {
        message: "Invalid request body",
        status: 400,
      };
    }

    return {
      message: "Internal server error",
      status: 500,
    };
  }
}
