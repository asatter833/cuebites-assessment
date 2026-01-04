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
  MapPin,
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
import { CreateScheduleSheet } from "./create/create.schedules";
import ScheduleNav from "./schedule-nav";
import { ScheduleDetailsSidebar } from "./schedule-details-sidebar";

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
      <div className="flex flex-col h-full overflow-hidden border rounded-md bg-white">
        {/* --- COMPACT MAIN HEADER --- */}
        <header className="flex w-full items-center justify-between px-4 py-2 bg-white border-b shadow-sm sticky top-0 z-40">
          <div className="flex flex-1 max-w-1/2 items-center justify-between gap-2">
            <div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none">
                Scheduler
              </h1>
              <p className="text-[10px] font-medium text-blue-600 uppercase tracking-wider mt-1">
                {format(weekStart, "MMMM yyyy")}
              </p>
            </div>
            <ScheduleNav />
            <div className="flex w-fit items-center border rounded-md bg-slate-50 p-0.5">
              <Button variant="ghost" size="icon" asChild className="h-7 w-7">
                <Link href={`/schedules?date=${prevWeek}`}>
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div className="px-3 py-0.5 flex items-center gap-2 text-xs font-semibold border-x mx-0.5">
                <CalendarIcon className="h-3 w-3 text-slate-400" />
                <span className="min-w-full">
                  {format(weekStart, "dd MMM")} -{" "}
                  {format(addDays(weekStart, 6), "dd MMM")}
                </span>
              </div>
              <Button variant="ghost" size="icon" asChild className="h-7 w-7">
                <Link href={`/schedules?date=${nextWeek}`}>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <CreateScheduleSheet staffList={allStaff} />
        </header>

        {/* --- COMPACT GRID HEADER --- */}
        <div className="grid grid-cols-[220px_1fr] border-b bg-slate-50/90 sticky top-[53px] z-30 backdrop-blur-sm">
          <div className="p-3 border-r flex items-center bg-slate-50 sticky left-0 z-10">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Team
            </span>
          </div>
          <div className="grid grid-cols-7 divide-x border-slate-200">
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                className={cn(
                  "p-2 text-center transition-colors",
                  isSameDay(day, new Date()) ? "bg-blue-50/50" : ""
                )}
              >
                <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">
                  {format(day, "EEE")}
                </p>
                <p
                  className={cn(
                    "text-xs font-bold mt-1",
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
              className="grid grid-cols-[220px_1fr] min-h-[60px] group transition-colors"
            >
              {/* Compact Staff Sidebar */}
              <div className="px-3 py-2 border-r flex items-center gap-2 sticky left-0 bg-white group-hover:bg-slate-50/80 z-20 transition-colors">
                <Avatar className="h-7 w-7 border shadow-sm shrink-0">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                      member.full_name
                    )}`}
                  />
                  <AvatarFallback>{member.full_name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-700 truncate leading-tight">
                    {member.full_name}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium uppercase truncate">
                    {member.job_title}
                  </span>
                </div>
              </div>

              {/* Compact Day Cells */}
              <div className="grid grid-cols-7 divide-x divide-slate-100 bg-white">
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
                      className="p-1 space-y-1 hover:bg-slate-50/40 transition-colors min-h-[60px]"
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
                                  "p-1.5 rounded border shadow-sm transition-all cursor-pointer relative border-l-4 cursor-pointer",
                                  hasConflict
                                    ? "bg-red-50 border-red-500 border-l-red-600 animate-pulse"
                                    : "bg-white border-slate-200 border-l-blue-500 hover:border-blue-400"
                                )}
                              >
                                {hasConflict && (
                                  <AlertTriangle className="absolute top-0.5 right-0.5 h-2.5 w-2.5 text-red-600" />
                                )}
                                <div className="font-bold text-[10px] text-slate-800 truncate leading-tight">
                                  {shift.client_name}
                                </div>
                                <div className="flex items-center gap-1 text-[8px] text-slate-500 font-medium mt-0.5">
                                  <Clock className="h-2 w-2 text-blue-400" />
                                  <span>
                                    {format(
                                      new Date(shift.start_time),
                                      "HH:mm"
                                    )}{" "}
                                    -{" "}
                                    {format(new Date(shift.end_time), "HH:mm")}
                                  </span>
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs p-2">
                              <p className="font-bold">{shift.client_name}</p>
                              <p className="text-muted-foreground">
                                {shift.address}
                              </p>
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
