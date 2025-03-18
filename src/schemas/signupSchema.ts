import { z } from "zod";

export const signupSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .refine(val => val.length > 0, "First name is required"),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .refine(val => val.length > 0, "Last name is required"),

  userName: z
    .string()
    .trim()
    .min(2, "Username must be at least 2 characters")
    .max(60, "Username cannot exceed 60 characters")
    .regex(
      /^[a-z][a-z0-9]{1,59}$/,
      "Username must start with a letter and contain only lowercase letters and numbers"
    )
    .refine(val => val.length > 0, "Username is required"),

  channelName: z
    .string()
    .trim()
    .min(2, "Channel name must be at least 2 characters")
    .max(60, "Channel name cannot exceed 60 characters")
    .regex(
      /^[a-zA-Z][a-zA-Z0-9 ]{1,59}$/,
      "Channel name must start with a letter and contain only letters, numbers, and spaces"
    )
    .refine(val => val.length > 0, "Channel name is required"),

  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .max(70, "Email cannot exceed 70 characters")
    .refine(val => val.length > 0, "Email is required"),

  password: z
    .string()
    .trim()
    .min(10, "Password must be at least 10 characters")
    .max(256, "Password cannot exceed 256 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_.,-])[A-Za-z\d!@#$%^&*_.,-]{10,256}$/,
      "Password must include one lowercase, one uppercase, one number, and one special character (!@#$%^&*_.,-)"
    )
    .refine(val => val.length > 0, "Password is required"),
});

export type SignupData = z.infer<typeof signupSchema>;