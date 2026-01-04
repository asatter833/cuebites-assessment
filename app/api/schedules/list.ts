"use server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { handlePrismaError } from "@/lib/prisma-error-handler";

interface ListScheduleFilters {
  search?: string;
  staff_id?: number;
  page?: number;
  pageSize?: number;
}

export default async function listSchedules(filters: ListScheduleFilters = {}) {
  const { search, staff_id, page = 1, pageSize = 10 } = filters;

  try {
    const skip = (page - 1) * pageSize;

    const where: Prisma.schedulesWhereInput = {};

    if (search) {
      where.client_name = {
        contains: search,
      };
    }

    if (staff_id) {
      where.staff_id = staff_id;
    }

    // 2. Fetch data and count in parallel
    const [data, total] = await Promise.all([
      prisma.schedules.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          staff: {
            select: {
              full_name: true,
              job_title: true,
              status: true,
            },
          },
        },
        orderBy: {
          start_time: "desc", // Show newest schedules first
        },
      }),
      prisma.schedules.count({ where }),
    ]);

    return {
      success: true,
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (err) {
    const prismaError = handlePrismaError(err);
    return { success: false, error: prismaError };
  }
}
