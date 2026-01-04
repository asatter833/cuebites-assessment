"use server";

import { gender } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { handlePrismaError } from "@/lib/prisma-error-handler";

type UpdateStaffPayload = {
  id: number;
  full_name?: string;
  dob?: Date;
  gender?: gender;
  phone?: string;
  email?: string;
  address?: string;
  job_title?: string;
  nationality?: string;
  is_favourite?: boolean;
  is_active?: boolean;
  status?: string;
};

export default async function updateStaff(params: UpdateStaffPayload) {
  try {
    const staff = await prisma.staff.update({
      where: { id: params.id },
      data: {
        ...params,
      },
    });
    return { success: true, data: staff };
  } catch (err) {
    const prismaError = handlePrismaError(err);
    return { success: false, error: prismaError };
  }
}
