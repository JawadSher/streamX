import { z } from "zod";

export const userUpdateSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .refine((val) => val.length > 0, "First name is required"),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .refine((val) => val.length > 0, "Last name is required"),

    phoneNumber: z
    .string()
    .trim()
    .max(15, "Phone number cannot exceed 15 characters")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),

    country: z
    .string()
    .trim()
    .max(256, "Country name cannot exceed 256 characters")
});

export type SignupData = z.infer<typeof userUpdateSchema>;
