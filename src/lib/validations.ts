import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  organizationName: z
    .string()
    .min(2, "Organization name must be at least 2 characters")
    .max(100, "Organization name must be less than 100 characters"),
});

export const expenseSchema = z.object({
  vendorName: z.string().min(1, "Vendor name is required").max(255),
  amount: z.coerce.number().positive("Amount must be positive"),
  currency: z.string().length(3).default("USD"),
  taxAmount: z.coerce.number().min(0).optional(),
  date: z.string().min(1, "Date is required"),
  description: z.string().max(1000).optional(),
  categoryId: z.string().uuid().optional(),
});

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color")
    .optional(),
  icon: z.string().max(50).optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
