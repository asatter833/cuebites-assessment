import { gender } from "@/generated/prisma/enums";
import { z } from "zod";

export const GenderEnum = z.enum([
  gender.male,
  gender.female,
  gender.nonBinary,
]);

// This regex supports international format: starts with optional +, then 10-15 digits
const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]{3}[)])?([-]?[\s]?[0-9])+$/
);

export const createStaffSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  dob: z.date().optional().nullable(),
  gender: GenderEnum,
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(phoneRegex, "Invalid phone number format (e.g., +1234567890)"),
  email: z.email("Invalid email address"),
  address: z.string().optional().nullable(),
  job_title: z.string().min(1, "Job title is required"),
  nationality: z.string().optional().nullable(),
  is_favourite: z.boolean(),
  is_active: z.boolean(),
  status: z.string(),
});

export type CreateStaffType = z.infer<typeof createStaffSchema>;
