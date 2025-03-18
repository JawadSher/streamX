import { z } from "zod";

const loginSchema = z
  .object({
    email: z
      .string()
      .regex(
        /^[a-zA-Z0-9](?:[a-zA-Z0-9.]{0,}[a-zA-Z0-9])?(?:\+[a-zA-Z0-9]+)?@gmail\.com$/,
        "Please enter a valid Gmail address (e.g., username@gmail.com)"
      )
      .optional(),

    userName: z
      .string()
      .min(2, "Username must be at least 2 characters long")
      .max(50, "Username must be less than 50 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .optional(),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{10,256}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*), and be 10-256 characters long"
      )
      .optional(),
  })
  .refine(
    (data) => data.email || data.userName,
    "Either email or username must be provided"
  );

export default loginSchema;
