"use server";

import { connectDB } from "@/lib/database";
import UserModel from "@/models/user.model";
import { ActionErrorType, ActionResponseType } from "@/lib/Types";
import { actionResponse } from "@/lib/actions-templates/ActionResponse";
import { actionError } from "@/lib/actions-templates/ActionError";
import { z } from "zod";


const userNameSchema = z
  .string()
  .trim()
  .min(2, 'Username must be at least 2 characters')
  .max(60, 'Username cannot exceed 60 characters')
  .regex(
    /^[a-z][a-z0-9]{1,59}$/,
    'Username must start with a letter and contain only lowercase letters and numbers'
  )
  .refine(val => val.length > 0, 'Username is required');

export async function checkUniqueUserName({
  userName,
}: {
  userName: string;
}): Promise<ActionErrorType | ActionResponseType> {
  try {
    if (!userName) {
      return actionError(422, "Username is required", null);
    }

    const result = await userNameSchema.safeParse(userName);
    if(!result.success){
      const errors = result.error.flatten().fieldErrors;
      const firstError = Object.values(errors).flat()[0] || "Invalid input";
      return actionError(422, firstError, null);
    }

    await connectDB();
    const user = await UserModel.findOne({ userName });

    if (user) {
      return actionError(409, "Username is already taken", null);
    }

    return actionResponse(200, "Username is available", null);
  } catch (error) {
    if (error instanceof Error) {
      return actionError(400, error.message, null);
    }
    return actionError(500, "Internal server error", null);
  }
}
