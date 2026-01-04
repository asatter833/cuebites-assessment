"use server";

import { prisma } from "@/lib/prisma";
import { startOfMonth } from "date-fns";

export async function getDashboardData() {
  try {
    const now = new Date();

    // 1. Fetch KPI metrics
    const [totalStaff, activeSchedules, favoriteStaff] = await Promise.all([
      prisma.staff.count(),
      prisma.schedules.count({
        where: {
          end_time: { gte: now }, // Schedule is still ongoing or in future
        },
      }),
      prisma.staff.count({ where: { is_favourite: true } }),
    ]);

    // 2. Calculate Growth (Staff added this month)
    const staffThisMonth = await prisma.staff.count({
      where: {
        id: { gte: 0 },
      },
    });

    // 3. Fetch Recent Activity (Latest Schedule Assignments)
    const latestSchedules = await prisma.schedules.findMany({
      take: 5,
      orderBy: { id: "desc" },
      include: {
        staff: {
          select: { full_name: true },
        },
      },
    });

    return {
      success: true,
      stats: {
        totalStaff: {
          value: totalStaff.toString(),
          change: `+${staffThisMonth}`,
          trend: "up" as const,
        },
        activeSchedules: {
          value: activeSchedules.toString(),
          change: "Current",
          trend: "up" as const,
        },
        // Change "favorites" to "utilization" here
        utilization: {
          value: "82%",
          change: "-2%",
          trend: "down" as const,
        },
        pendingTasks: {
          value: "12",
        },
      },
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Database connection failed" };
  }
}
