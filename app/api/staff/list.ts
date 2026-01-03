"use server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export default async function listStaff(filters?: {
  search?: string;
  status?: string;
}) {
  try {
    const { search, status } = filters || {};

    const where: Prisma.staffWhereInput = {
      AND: [],
    };

    if (search) {
      where.OR = [
        { full_name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const staffList = await prisma.staff.findMany({
      where,
      orderBy: {
        full_name: "asc",
      },
    });

    return {
      message: `${staffList.length} ${
        staffList.length === 1 ? "Staff" : "Staffs"
      } found`,
      data: staffList,
    };
  } catch {
    return { message: "Error retrieving staff records", data: [] };
  }
}
