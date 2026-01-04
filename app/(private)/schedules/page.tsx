import { prisma } from "@/lib/prisma";
import { schedules, staff } from "@/generated/prisma/client";
import { startOfWeek, format } from "date-fns";
import listSchedules from "@/app/api/schedules/list";
import { ResourceScheduler } from "./_components/calendar-view";
import ScheduleNav from "./_components/schedule-nav";
import { CreateScheduleSheet } from "./_components/create/create.schedules";

// Define the type for the joined data used in the grid
export type ScheduleWithStaff = schedules & {
  staff: Pick<staff, "full_name" | "job_title" | "status">;
};

interface PageProps {
  searchParams: Promise<{
    date?: string;
    staff_id?: string;
    query?: string;
  }>;
}

export default async function SchedulesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // 1. Handle Date Logic
  // If no date is provided, default to current week.
  // weekStartsOn: 1 sets Monday as the first day of the week.
  const referenceDate = params.date ? new Date(params.date) : new Date();
  const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 });
  const searchQuery = params.query || "";

  // 2. Fetch Data (Parallel for performance)
  const [schedulesRes, allStaff] = await Promise.all([
    listSchedules({
      pageSize: 500, // Large fetch to cover the grid
    }),
    prisma.staff.findMany({
      where: {
        is_active: true,
        // The search filter:
        ...(searchQuery && {
          full_name: {
            contains: searchQuery,
          },
        }),
      },
      orderBy: { full_name: "asc" },
    }),
  ]);

  const schedulesData = (schedulesRes.data as ScheduleWithStaff[]) || [];

  return (
    <div className="flex flex-col max-h-[92vh] bg-slate-50/50 p-4 gap-4 overflow-hidden">
      {/* --- MAIN CALENDAR GRID --- */}
      <main className="flex-1 min-h-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <ResourceScheduler
          schedules={schedulesData}
          allStaff={allStaff}
          weekStart={weekStart}
        />
      </main>

      {/* --- COMPACT FOOTER --- */}
      <footer className="px-1 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
              Total Personnel
            </span>
            <span className="text-xs font-semibold text-slate-600">
              {allStaff.length} Active Members
            </span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
              Shift Density
            </span>
            <span className="text-xs font-semibold text-slate-600">
              {schedulesData.length} Assignments this view
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">
            Current System Time
          </span>
          <span className="text-xs font-mono font-medium text-slate-600">
            {format(new Date(), "HH:mm:ss")}
          </span>
        </div>
      </footer>
    </div>
  );
}
