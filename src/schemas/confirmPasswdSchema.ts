import { z } from "zod";

const confPassSchema = z
  .object({
    password: z
      .string()
      .trim()
      .min(10, "Password must be at least 10 characters")
      .max(256, "Password cannot exceed 256 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_.,-])[A-Za-z\d!@#$%^&*_.,-]{10,256}$/,
        "Password must include one lowercase, one uppercase, one number, and one special character (!@#$%^&*_.,-)"
      ),

    confPasswd: z
      .string()
      .trim()
      .min(10, "Password must be at least 10 characters")
      .max(256, "Password cannot exceed 256 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_.,-])[A-Za-z\d!@#$%^&*_.,-]{10,256}$/,
        "Password must include one lowercase, one uppercase, one number, and one special character (!@#$%^&*_.,-)"
      ),
  })
  .refine((data) => data.password === data.confPasswd, {
    message: "Passwords do not match",
    path: ["confPasswd"],
  });

export default confPassSchema;