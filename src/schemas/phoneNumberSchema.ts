import { z } from "zod";

export const phoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .max(15, "Phone number cannot exceed 15 characters")
    .regex(
      /^0\d{10}$/,
      "Please enter a valid 11-digit phone number - eg: +xxxxxxxxxxx"
    ),
});
