import UserModel from "@/models/user.model";
import { connectDB } from "./database";

export const validateUserCredentials = async (
  email: string,
  password: string
) => {
  await connectDB();
  const user = await UserModel.findOne({ email });
  if (!user) {
    return { success: false };
  }

  const isValid = await user.isPasswordCorrect(password);
  if (!isValid) {
    return { success: false };
  }

  return {
    success: true,
  };
};
