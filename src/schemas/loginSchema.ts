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
      .refine((val) => val !== "", {
        message: "Email cannot be empty if provided",
      }),

    password: z
      .string()
      .trim()
      .min(10, "Password must be at least 10 characters")
      .max(256, "Password cannot exceed 256 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{10,256}$/,
        "Password must include uppercase, lowercase, number, & special char (!@#$%^&*)"
      )
      .refine((val) => val.length > 0, {
        message: "Password is required",
      }),
  })
  .refine(
    (data) => !!data.email, {
      message: "Email must be provided",
    }
  );

export type LoginData = z.infer<typeof loginSchema>;

export default loginSchema;