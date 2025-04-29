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
        "Password must contain a lowercase, an uppercase, a number, and a special character (!@#$%^&*_,.-)"
      ),

    confPasswd: z
      .string()
      .trim()
      .min(10, "Password must be at least 10 characters")
      .max(256, "Password cannot exceed 256 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_.,-])[A-Za-z\d!@#$%^&*_.,-]{10,256}$/,
        "Password must contain a lowercase, an uppercase, a number, and a special character (!@#$%^&*_,.-)"
      ),
  })
  .refine((data) => data.password === data.confPasswd, {
    message: "Passwords do not match",
    path: ["confPasswd"],
  });

export default confPassSchema;