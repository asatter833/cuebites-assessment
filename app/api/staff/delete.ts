"use server";

import { prisma } from "@/lib/prisma";
import { handlePrismaError } from "@/lib/prisma-error-handler";

export default async function deleteStaff(id: number) {
  try {
    const staff = await prisma.staff.delete({
      where: { id },
    });
    return { success: true, data: staff };
  } catch (error) {
    return handlePrismaError(error);
  }
}
