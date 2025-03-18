import { z } from "zod";

export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .max(70, "Email cannot exceed 70 characters")
      .email("Please enter a valid email address")
      .regex(
        /^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._%+-]*@gmail\.com$/,
        "Please enter a valid Gmail address (e.g., username@gmail.com)"
      )
      .optional()
      .refine((val) => val !== "", {
        message: "Email cannot be empty if provided",
      }),

    userName: z
      .string()
      .trim()
      .min(2, "Username must be at least 2 characters")
      .max(50, "Username cannot exceed 50 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .optional()
      .refine((val) => val !== "", {
        message: "Username cannot be empty if provided",
      }),

    password: z
      .string()
      .trim()
      .min(10, "Password must be at least 10 characters")
      .max(256, "Password cannot exceed 256 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{10,256}$/,
        "Password must include one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)"
      )
      .refine((val) => val.length > 0, {
        message: "Password is required",
      }),
  })
  .refine(
    (data) => !!data.email || !!data.userName,
    {
      message: "Either email or username must be provided",
      path: [], // Top-level error
    }
  );

export type LoginData = z.infer<typeof loginSchema>;

export default loginSchema;