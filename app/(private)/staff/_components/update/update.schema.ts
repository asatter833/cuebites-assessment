import { gender } from "@/generated/prisma/enums";
import { z } from "zod";

export const GenderEnum = z.enum([
  gender.male,
  gender.female,
  gender.nonBinary,
]);

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]{3}[)])?([-]?[\s]?[0-9])+$/
);

export const updateStaffSchema = z.object({
  id: z.number(),
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
  nationality: z.string().min(1, "Nationality is required"),
  is_favourite: z.boolean(),
  is_active: z.boolean(),
  status: z.string().min(1, "Status is required"),
});

export type UpdateStaffType = z.infer<typeof updateStaffSchema>;
