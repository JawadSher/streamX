"use server";
import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
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
  if (result?.error) {
    const errorMessage = result.error.issues
      .map((issue) => issue.message)
      .join(", ");
    return { status: "error", message: errorMessage };
  }

  try {
    const response = await axiosInstance.get(
      `/api/check-username?username=${encodeURIComponent(result.data)}`
    );
    const data = response.data;

    if (response.status === 200) {
      return { status: "available", message: "Username is available" };
    } else {
      return { status: "error", message: data.error || "Unknown error" };
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage =
        error.response?.data?.error || "Error checking username";
      return { status: "error", message: errorMessage };
    }
    return { status: "error", message: "Unexpected error occurred" };
  }
}