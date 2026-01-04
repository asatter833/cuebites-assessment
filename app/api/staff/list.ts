"use server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export default async function listStaff(filters?: {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  try {
    const { search, status, page = 1, pageSize = 10 } = filters || {};
    const skip = (page - 1) * pageSize;
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
    const total = await prisma.staff.count({ where });
    const staffList = await prisma.staff.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: {
        full_name: "asc",
      },
    });

    return {
      data: staffList,
      meta: {
        total,
        pageCount: Math.ceil(total / pageSize),
        currentPage: page,
      },
      message: `${staffList.length} ${
        staffList.length === 1 ? "Staff" : "Staffs"
      } found`,
    };
  } catch {
    return {
      message: "Error retrieving staff records",
      data: [],
      meta: { total: 0, pageCount: 0, currentPage: 1 },
    };
  }
}
