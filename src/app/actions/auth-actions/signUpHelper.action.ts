import { connectDB } from "@/lib/database";
import User from "@/models/user.model";
import notifyKakfa from "@/lib/notifyKafka";
import bcrypt from "bcryptjs";
import { IUserData } from "./authSignUp.action";
import { ActionErrorType, ActionResponseType } from "@/lib/Types";
import { actionError } from "@/lib/actions-templates/ActionError";
import { actionResponse } from "@/lib/actions-templates/ActionResponse";

export async function signUpHelper({
  userData,
}: {
  userData: IUserData;
}): Promise<ActionResponseType | ActionErrorType> {
  try {
    await connectDB();

    const userExists = await User.findOne({
      $or: [
        { email: userData?.email?.toLowerCase() },
        { userName: userData?.userName?.toLowerCase() },
      ],
    });

    if (userExists) {
      return actionError(409, "Account already exists", {});
    }

    if (!userData?.password) {
      return actionError(400, "Password is required", {});
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

    return actionResponse(201, "User account created successfully", userWithoutPassword);
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      return actionError(400, "Invalid request body", {error});
    }

    return actionError(500, "Internal server error", {error});
  }
}
