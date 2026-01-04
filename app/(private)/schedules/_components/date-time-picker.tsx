"use client";

import * as React from "react";
import { CalendarIcon, Clock } from "lucide-react";
import { format, setHours, setMinutes } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  label?: string;
}

export function DateTimePicker({
  value,
  onChange,
  label,
}: DateTimePickerProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 5-min increments

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    const result = value
      ? setHours(setMinutes(date, value.getMinutes()), value.getHours())
      : date;
    onChange(result);
  };

  const handleTimeSelect = (type: "hour" | "minute", val: number) => {
    const baseDate = value || new Date();
    if (type === "hour") {
      onChange(setHours(baseDate, val));
    } else {
      onChange(setMinutes(baseDate, val));
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            format(value, "MMM d, yyyy HH:mm")
          ) : (
            <span>{label || "Pick a date"}</span>
          )}
        </Button>
      </PopoverTrigger>

      {/* FIX 1: We use a fixed width [420px] to accommodate Calendar (approx 280px) + Hours (70px) + Minutes (70px).
        FIX 2: pointer-events-auto ensures the popover doesn't close prematurely.
      */}
      <PopoverContent className="w-[420px] p-0 overflow-hidden" align="start">
        <div className="flex h-[300px] divide-x divide-border">
          {/* COLUMN 1: CALENDAR (Fixed width) */}
          <div className="flex-1 min-w-[280px]">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              initialFocus
              className="p-3"
            />
          </div>

          {/* COLUMN 2: HOURS (Native Scrolling) */}
          <div className="flex flex-col w-[70px] bg-slate-50/50">
            <div className="h-10 flex items-center justify-center border-b bg-white shrink-0">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">
                Hrs
              </span>
            </div>
            {/* FIX 3: We use a standard div with overflow-y-auto instead of ScrollArea.
               This is much more stable in nested popovers. 
            */}
            <div className="flex-1 overflow-y-auto p-1 space-y-1">
              {hours.map((h) => {
                const isSelected = value?.getHours() === h;
                return (
                  <Button
                    key={h}
                    variant={isSelected ? "default" : "ghost"}
                    className={cn(
                      "w-full h-8 text-xs shrink-0",
                      isSelected && "bg-blue-600 hover:bg-blue-700 text-white"
                    )}
                    onClick={() => handleTimeSelect("hour", h)}
                  >
                    {h.toString().padStart(2, "0")}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* COLUMN 3: MINUTES (Native Scrolling) */}
          <div className="flex flex-col w-[70px] bg-slate-50/50">
            <div className="h-10 flex items-center justify-center border-b bg-white shrink-0">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">
                Min
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-1 space-y-1">
              {minutes.map((m) => {
                const isSelected = value?.getMinutes() === m;
                return (
                  <Button
                    key={m}
                    variant={isSelected ? "default" : "ghost"}
                    className={cn(
                      "w-full h-8 text-xs shrink-0",
                      isSelected && "bg-blue-600 hover:bg-blue-700 text-white"
                    )}
                    onClick={() => handleTimeSelect("minute", m)}
                  >
                    {m.toString().padStart(2, "0")}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
