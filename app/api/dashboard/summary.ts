"use server";

import { prisma } from "@/lib/prisma";
export interface DashboardStats {
  value: string;
  change?: string;
  trend?: "up" | "down";
}

export interface DashboardLog {
  id: number;
  name: string;
  action: string;
  time: string;
  type: "info" | "danger" | "success";
}
export interface DashboardResponse {
  success: boolean;
  error?: string;
  stats?: {
    totalStaff: DashboardStats;
    activeSchedules: DashboardStats;
    utilization: DashboardStats;
    pendingTasks: DashboardStats;
  };
  recentLogs: DashboardLog[]; // Ensure this is always here or optional
}
export async function getDashboardData(): Promise<DashboardResponse> {
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
        totalStaff: { value: totalStaff.toString(), change: "+2", trend: "up" },
        activeSchedules: { value: activeSchedules.toString() },
        utilization: { value: "82%", change: "-2%", trend: "down" },
        pendingTasks: { value: "12" },
      },
      recentLogs: latestSchedules.map((s) => ({
        id: s.id,
        name: s.staff.full_name,
        action: `Assigned to ${s.client_name}`,
        time: "Recently",
        type: "info",
      })),
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to load",
      recentLogs: [], // Return empty array to satisfy the type
    };
  }
}
