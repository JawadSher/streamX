"use server";
import { connectDB } from "@/lib/database";
import UserModel from "@/models/user.model";
import { z } from "zod";

const userNameSchema = z
  .string()
  .trim()
  .min(2, "Username must be at least 2 characters")
  .max(60, "Username cannot exceed 60 characters")
  .toLowerCase()
  .regex(
    /^[a-z][a-z0-9]{1,59}$/,
    "Username must start with a letter and contain only lowercase letters and numbers"
  )
  .refine((val) => val.length > 0, "Username is required");

export async function checkUserName(value: string) {
  if (!value) {
    return { status: "empty", message: "" };
  }

  const result = userNameSchema.safeParse(value);
  if (!result.success) {
    const errorMessage = result.error.issues
      .map((issue) => issue.message)
      .join(", ");
    return { status: "error", message: errorMessage };
  }

  const userName = `@${result.data}`;
  try {
    await connectDB();
    const user = await UserModel.findOne({ userName });

    if (user) {
      return { status: "error", message: "Username is already taken" };
    }

    return { status: "available", message: "Username is available" };
  } catch (error) {
    console.error("Username check error:", error);
    return { status: "error", message: "Unexpected error occurred" };
  }
}