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

  country: z
    .string()
    .trim()
    .max(256, "Country name cannot exceed 256 characters"),

  userName: z
    .string()
    .trim()
    .min(2, "Username must be at least 2 characters")
    .max(60, "Username cannot exceed 60 characters")
    .regex(
      /^[a-z][a-z0-9]{1,59}$/,
      "Username must start with a letter and contain only lowercase letters and numbers"
    )
    .refine((val) => val.length > 0, "Username is required")
    .optional(),

  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .max(70, "Email cannot exceed 70 characters")
    .refine((val) => val.length > 0, "Email is required")
    .optional(),
});

export type SignupData = z.infer<typeof userUpdateSchema>;
