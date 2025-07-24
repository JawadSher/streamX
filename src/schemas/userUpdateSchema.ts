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
    .max(256, "Country name cannot exceed 256 characters")
    .optional()
    .or(z.literal("")),
});

export type SignupData = z.infer<typeof userUpdateSchema>;
