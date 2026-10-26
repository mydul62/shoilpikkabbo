import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().regex(/^[0-9+]{11,14}$/, "Valid phone number required"),
    email: z.string().email("Valid email required").optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    phone: z.string().min(1, "Phone number required"),
    password: z.string().min(1, "Password required"),
  }),
});
