"use server";

import { UpdateStaffType } from "@/app/(private)/staff/_components/update/update.schema";
import { prisma } from "@/lib/prisma";
import { handlePrismaError } from "@/lib/prisma-error-handler";

export default async function updateStaff(params: UpdateStaffType) {
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
