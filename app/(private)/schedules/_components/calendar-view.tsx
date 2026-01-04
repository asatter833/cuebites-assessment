"use client";

import React from "react";
import Link from "next/link";
import {
  format,
  addDays,
  subDays,
  isSameDay,
  areIntervalsOverlapping,
} from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScheduleWithStaff } from "../page";
import { staff } from "@/generated/prisma/client";
import {
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScheduleDetailsSidebar } from "./schedule-details-sidebar";
import ScheduleNav from "./schedule-nav";
import { CreateScheduleSheet } from "./create/create.schedules";

interface ResourceSchedulerProps {
  schedules: ScheduleWithStaff[];
  allStaff: staff[];
  weekStart: Date;
}

export function ResourceScheduler({
  schedules,
  allStaff,
  weekStart,
}: ResourceSchedulerProps) {
  const [selectedShift, setSelectedShift] =
    React.useState<ScheduleWithStaff | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const handleShiftClick = (shift: ScheduleWithStaff) => {
    setSelectedShift(shift);
    setIsSidebarOpen(true);
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const prevWeek = format(subDays(weekStart, 7), "yyyy-MM-dd");
  const nextWeek = format(addDays(weekStart, 7), "yyyy-MM-dd");

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full overflow-hidden bg-white">
        <div className="flex items-center gap-4 px-4 py-2 border-b border-slate-100 bg-slate-50/30">
          {/* Left: Date Display */}
          <div className="flex flex-col min-w-[100px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              Viewing Week
            </span>
            <span className="text-xs font-bold text-slate-700 mt-1">
              {format(weekStart, "MMMM yyyy")}
            </span>
          </div>

          {/* Middle: Search & Navigation */}
          <div className="flex items-center gap-3">
            <ScheduleNav />

            <div className="flex items-center border border-slate-200 rounded-md bg-white shadow-sm p-0.5">
              <Button variant="ghost" size="icon" asChild className="h-6 w-6">
                <Link href={`/schedules?date=${prevWeek}`}>
                  <ChevronLeft className="h-3.5 w-3.5 text-slate-500" />
                </Link>
              </Button>
              <div className="px-3 py-0.5 flex items-center gap-2 text-[11px] font-bold text-slate-600 border-x border-slate-100 mx-0.5 min-w-[140px] justify-center">
                <CalendarIcon className="h-3 w-3 text-blue-500" />
                {format(weekStart, "dd MMM")} —{" "}
                {format(addDays(weekStart, 6), "dd MMM")}
              </div>
              <Button variant="ghost" size="icon" asChild className="h-6 w-6">
                <Link href={`/schedules?date=${nextWeek}`}>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: Create Button (Pushed to end) */}
          <div className="ml-auto flex items-center gap-3">
            <CreateScheduleSheet
              staffList={allStaff.filter((s) => s.status === "active")}
            />
          </div>
        </div>

        {/* --- STICKY GRID HEADER --- */}
        <div className="grid grid-cols-[200px_1fr] border-b border-slate-200 bg-slate-50/90 sticky top-0 z-30 backdrop-blur-sm">
          <div className="p-3 border-r border-slate-200 flex items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Personnel
            </span>
          </div>
          <div className="grid grid-cols-7 divide-x divide-slate-200">
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                className={cn(
                  "py-2 px-1 text-center transition-colors",
                  isSameDay(day, new Date()) ? "bg-blue-50/50" : ""
                )}
              >
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                  {format(day, "EEEE")}
                </p>
                <p
                  className={cn(
                    "text-[11px] font-bold mt-0.5",
                    isSameDay(day, new Date())
                      ? "text-blue-600"
                      : "text-slate-700"
                  )}
                >
                  {format(day, "dd MMM")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* --- GRID BODY --- */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {allStaff.map((member) => (
            <div
              key={member.id}
              className="grid grid-cols-[200px_1fr] min-h-[52px] group hover:bg-slate-50/30 transition-colors"
            >
              <div className="px-3 py-2 border-r border-slate-100 flex items-center gap-2.5 sticky left-0 bg-white group-hover:bg-slate-50/80 z-20">
                <Avatar className="h-7 w-7 border border-slate-200 shadow-sm shrink-0 rounded-md">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                      member.full_name
                    )}`}
                  />
                  <AvatarFallback className="text-[10px] font-bold">
                    {member.full_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] font-bold text-slate-900 truncate tracking-tight">
                    {member.full_name}
                  </span>
                  <span className="text-[9px] text-blue-600 font-bold uppercase tracking-wide truncate">
                    {member.job_title}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-7 divide-x divide-slate-100 bg-transparent">
                {weekDays.map((day) => {
                  const dayShifts = schedules
                    .filter(
                      (s) =>
                        s.staff_id === member.id &&
                        isSameDay(new Date(s.start_time), day)
                    )
                    .sort(
                      (a, b) =>
                        new Date(a.start_time).getTime() -
                        new Date(b.start_time).getTime()
                    );

                  return (
                    <div
                      key={day.toISOString()}
                      className="p-1 gap-1 flex flex-col min-h-[52px]"
                    >
                      {dayShifts.map((shift, idx) => {
                        const hasConflict =
                          idx > 0 &&
                          areIntervalsOverlapping(
                            {
                              start: new Date(dayShifts[idx - 1].start_time),
                              end: new Date(dayShifts[idx - 1].end_time),
                            },
                            {
                              start: new Date(shift.start_time),
                              end: new Date(shift.end_time),
                            }
                          );

                        return (
                          <Tooltip key={shift.id}>
                            <TooltipTrigger asChild>
                              <div
                                onClick={() => handleShiftClick(shift)}
                                className={cn(
                                  "p-1.5 rounded border shadow-sm transition-all cursor-pointer border-l-[3px]",
                                  hasConflict
                                    ? "bg-red-50 border-red-200 border-l-red-500"
                                    : "bg-white border-slate-200 border-l-blue-500 hover:shadow-md"
                                )}
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-bold text-[10px] text-slate-800 truncate leading-tight uppercase tracking-tight">
                                    {shift.client_name}
                                  </span>
                                  {hasConflict && (
                                    <AlertTriangle className="h-2.5 w-2.5 text-red-600 shrink-0" />
                                  )}
                                </div>
                                <div className="flex items-center gap-1 text-[9px] text-slate-500 font-bold mt-0.5">
                                  <Clock className="h-2.5 w-2.5 text-slate-400" />
                                  {format(new Date(shift.start_time), "HH:mm")}{" "}
                                  - {format(new Date(shift.end_time), "HH:mm")}
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="text-[11px] font-medium bg-slate-900 text-white border-none shadow-xl"
                            >
                              <p className="font-bold">{shift.client_name}</p>
                              <p className="opacity-80">{shift.address}</p>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <ScheduleDetailsSidebar
          shift={selectedShift}
          open={isSidebarOpen}
          onOpenChange={setIsSidebarOpen}
        />
      </div>
    </TooltipProvider>
  );
}
