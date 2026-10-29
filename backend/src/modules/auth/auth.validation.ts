import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().regex(/^[0-9+]{10,14}$/, "Valid 11-digit Bangladeshi phone number required"),
    email: z.string().email("Valid email required").optional().or(z.literal("")),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

export const loginSchema = z.object({
  body: z
    .object({
      email: z.string().optional(),
      phone: z.string().optional(),
      emailOrPhone: z.string().optional(),
      identifier: z.string().optional(),
      password: z.string().min(1, "Password is required"),
    })
    .refine((data) => data.email || data.phone || data.emailOrPhone || data.identifier, {
      message: "Please provide either an email or phone number to sign in",
      path: ["emailOrPhone"],
    }),
});
