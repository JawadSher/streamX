import { z } from "zod";

export const phoneNumberSchema = z.object({
  phoneNumber: z
    .union([
      z
        .string()
        .regex(
          /^\+(?:[1-9]\d{0,3})\d{6,14}$/,
          "Please enter a valid international phone number (e.g., +1234567890)"
        ),
      z.literal(""),
    ])
    .optional(),
});
