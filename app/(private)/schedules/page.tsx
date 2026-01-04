import { prisma } from "@/lib/prisma";
import { schedules, staff } from "@/generated/prisma/client";
import { startOfWeek, format } from "date-fns";
import listSchedules from "@/app/api/schedules/list";
import { ResourceScheduler } from "./_components/calendar-view";
import { Separator } from "@/components/ui/separator";

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

  const referenceDate = params.date ? new Date(params.date) : new Date();
  const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 });
  const searchQuery = params.query || "";

  const [schedulesRes, allStaff] = await Promise.all([
    listSchedules({
      pageSize: 500,
    }),
    prisma.staff.findMany({
      where: {
        is_active: true,
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
    <div className="flex flex-col max-h-full bg-slate-50/50 gap-0 overflow-hidden">
      {/* --- MAIN CALENDAR GRID --- */}
      <main className="flex-1 min-h-0 p-4 pt-4">
        <div className="h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <ResourceScheduler
            schedules={schedulesData}
            allStaff={allStaff}
            weekStart={weekStart}
          />
        </div>
      </main>

      {/* --- COMPACT FOOTER (Sidebar Sync) --- */}
      <footer className="h-12 border-t border-slate-200 bg-white px-6 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Staff:
            </span>
            <span className="text-[11px] font-bold text-slate-600">
              {allStaff.length} ACTIVE
            </span>
          </div>
          <Separator orientation="vertical" className="h-3 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Assignments:
            </span>
            <span className="text-[11px] font-bold text-slate-600">
              {schedulesData.length} TOTAL
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
            System Live: {format(new Date(), "HH:mm")}
          </span>
        </div>
      </footer>
    </div>
  );
}
