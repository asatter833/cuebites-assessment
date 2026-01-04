"use client";

import React from "react";
import { format, addDays, isSameDay, areIntervalsOverlapping } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ScheduleWithStaff } from "../page";
import { staff } from "@/generated/prisma/client";
import { Clock, MapPin, AlertTriangle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  // Generate the 7 days of the week based on the navigation start date
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full overflow-hidden border rounded-xl bg-white shadow-sm">
        {/* --- GRID HEADER --- */}
        <div className="grid grid-cols-[280px_1fr] border-b bg-slate-50/80 sticky top-0 z-30">
          <div className="p-4 border-r flex items-center justify-between bg-slate-50">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              Team Members
            </span>
          </div>
          <div className="grid grid-cols-7 divide-x border-slate-200">
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                className={cn(
                  "p-3 text-center transition-colors",
                  isSameDay(day, new Date()) ? "bg-blue-50/50" : ""
                )}
              >
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  {format(day, "EEE")}
                </p>
                <p
                  className={cn(
                    "text-sm font-black",
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
              className="grid grid-cols-[280px_1fr] min-h-[120px] group transition-colors"
            >
              {/* Staff Sidebar (Sticky) */}
              <div className="p-4 border-r flex items-center gap-3 sticky left-0 bg-white group-hover:bg-slate-50/80 z-20 transition-colors">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.full_name}`}
                  />
                  <AvatarFallback>{member.full_name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-slate-700 truncate">
                    {member.full_name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight truncate">
                    {member.job_title}
                  </span>
                </div>
              </div>

              {/* Day Cells */}
              <div className="grid grid-cols-7 divide-x divide-slate-100">
                {weekDays.map((day) => {
                  // Filter and Sort shifts for this person on this day
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
                      className="p-2 space-y-2 bg-slate-50/10 hover:bg-slate-50/40 transition-colors min-h-[120px]"
                    >
                      {dayShifts.map((shift, idx) => {
                        // Conflict Detection: Check if this shift overlaps with the previous one
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
                                className={cn(
                                  "p-2 rounded-md border shadow-sm transition-all cursor-pointer relative",
                                  "border-l-[4px]",
                                  hasConflict
                                    ? "bg-red-50 border-red-500 border-l-red-600 animate-pulse"
                                    : "bg-white border-slate-200 border-l-blue-500 hover:border-blue-400 hover:shadow-md"
                                )}
                              >
                                {hasConflict && (
                                  <AlertTriangle className="absolute top-1 right-1 h-3 w-3 text-red-600" />
                                )}

                                <div className="font-bold text-[11px] text-slate-800 truncate mb-1">
                                  {shift.client_name}
                                </div>

                                <div className="flex items-center gap-1 text-[9px] text-slate-500 font-medium">
                                  <Clock className="h-2.5 w-2.5 text-blue-400" />
                                  {format(new Date(shift.start_time), "h:mm a")}{" "}
                                  - {format(new Date(shift.end_time), "h:mm a")}
                                </div>

                                <div className="flex items-center gap-1 text-[9px] text-slate-400 truncate mt-1">
                                  <MapPin className="h-2.5 w-2.5 shrink-0" />
                                  <span className="truncate">
                                    {shift.address}
                                  </span>
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="right"
                              className="max-w-[200px]"
                            >
                              <p className="font-bold">{shift.client_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {shift.address}
                              </p>
                              {shift.remarks && (
                                <p className="text-[10px] italic mt-1 border-t pt-1">
                                  {shift.remarks}
                                </p>
                              )}
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
      </div>
    </TooltipProvider>
  );
}
