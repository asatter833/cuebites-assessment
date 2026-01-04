import { prisma } from "@/lib/prisma";
import { schedules, staff } from "@/generated/prisma/client";
import { startOfWeek, format, addDays, subDays } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import listSchedules from "@/app/api/schedules/list";
import { CreateScheduleSheet } from "./_components/create/create.schedules";
import { ResourceScheduler } from "./_components/calendar-view";

// Define the type for the joined data
export type ScheduleWithStaff = schedules & {
  staff: Pick<staff, "full_name" | "job_title" | "status">;
};

interface PageProps {
  searchParams: Promise<{
    date?: string;
    staff_id?: string;
  }>;
}

export default async function SchedulesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // 1. Handle Date Logic (Navigation)
  const referenceDate = params.date ? new Date(params.date) : new Date();
  const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 });

  const prevWeek = format(subDays(weekStart, 7), "yyyy-MM-dd");
  const nextWeek = format(addDays(weekStart, 7), "yyyy-MM-dd");

  // 2. Fetch Data (Schedules + Active Staff)
  const [schedulesRes, allStaff] = await Promise.all([
    listSchedules({
      pageSize: 300, // Large fetch for the calendar grid
      staff_id: params.staff_id ? Number(params.staff_id) : undefined,
    }),
    prisma.staff.findMany({
      where: { is_active: true },
      orderBy: { full_name: "asc" },
    }),
  ]);

  const schedulesData = (schedulesRes.data as ScheduleWithStaff[]) || [];

  return (
    <div className="flex flex-col h-screen bg-slate-50/50">
      {/* --- SCHEDULER HEADER (ShiftCare Style) --- */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Scheduler
            </h1>
            <p className="text-[11px] font-medium text-blue-600 uppercase tracking-wider">
              {format(weekStart, "MMMM yyyy")}
            </p>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center border rounded-md bg-slate-50 p-1">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <Link href={`/schedules?date=${prevWeek}`}>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>

            <div className="px-4 py-1 flex items-center gap-2 text-sm font-semibold border-x mx-1">
              <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
              <span>
                {format(weekStart, "dd MMM")} -{" "}
                {format(addDays(weekStart, 6), "dd MMM")}
              </span>
            </div>

            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <Link href={`/schedules?date=${nextWeek}`}>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Shadcn Sidebar Sheet for creation */}
          <CreateScheduleSheet staffList={allStaff} />
        </div>
      </header>

      {/* --- MAIN GRID VIEW --- */}
      <main className="p-6 overflow-hidden flex-1 flex flex-col">
        <div className="flex-1 bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
          <ResourceScheduler
            schedules={schedulesData}
            allStaff={allStaff}
            weekStart={weekStart}
          />
        </div>
      </main>

      {/* --- FOOTER STATS --- */}
      <footer className="px-6 py-2 bg-white border-t flex justify-between items-center text-[10px] text-slate-400 font-medium uppercase tracking-widest">
        <div className="flex gap-4">
          <span>Total Staff: {allStaff.length}</span>
          <span>Active Shifts: {schedulesData.length}</span>
        </div>
        <div>Local Time: {format(new Date(), "HH:mm")}</div>
      </footer>
    </div>
  );
}
