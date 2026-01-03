import { gender } from "@/generated/prisma/enums";
import { z } from "zod";

export const GenderEnum = z.enum([
  gender.male,
  gender.female,
  gender.nonBinary,
]);

export const createStaffSchema = z.object({
  full_name: z.string(),
  dob: z.date().optional(),
  gender: GenderEnum,
  phone: z.string(),
  email: z.email(),
  address: z.string().optional(),
  job_title: z.string(),
  nationality: z.string().optional(),
  is_favourite: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

export type CreateStaffType = z.infer<typeof createStaffSchema>;
