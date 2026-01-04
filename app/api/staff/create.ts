"use server";

import { CreateStaffType } from "@/app/(private)/staff/(create)/schema.staff";
import { prisma } from "@/lib/prisma";
import { handlePrismaError } from "@/lib/prisma-error-handler";

export default async function createStaff(params: CreateStaffType) {
  try {
    const staff = await prisma.staff.create({
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
