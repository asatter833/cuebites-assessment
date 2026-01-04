"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, CalendarIcon } from "lucide-react";
import { format, setHours, setMinutes } from "date-fns";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { staff } from "@/generated/prisma/client";
import { createScheduleSchema, CreateScheduleType } from "./create.schema";
import { createSchedule } from "@/app/api/schedules/create";
import { Separator } from "@/components/ui/separator";
import { DateTimePicker } from "../date-time-picker";

interface CreateScheduleSheetProps {
  staffList: staff[];
}

export function CreateScheduleSheet({ staffList }: CreateScheduleSheetProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<CreateScheduleType>({
    resolver: zodResolver(createScheduleSchema),
    defaultValues: {
      client_name: "",
      address: "",
      shift_bonus: 0,
      remarks: "",
    },
  });

  async function onSubmit(values: CreateScheduleType) {
    setIsPending(true);
    const result = await createSchedule(values);
    setIsPending(false);

    if (result.success) {
      toast.success("Schedule created successfully");
      form.reset();
      setOpen(false);
    } else {
      toast.error(result.error || "Failed to create schedule");
    }
  }

  // Helper to update the time portion of an existing Date object
  const handleTimeChange = (
    currentDate: Date | undefined,
    timeString: string,
    fieldChange: (date: Date) => void
  ) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = currentDate || new Date();
    const newDate = setHours(setMinutes(date, minutes), hours);
    fieldChange(newDate);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Add New Shift
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[440px] overflow-y-auto">
        <SheetHeader className="pt-4 pb-0">
          <SheetTitle>Create Shift</SheetTitle>
          <SheetDescription>
            Assign a new shift to a staff member. Fill in the details.
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 px-1"
          >
            {/* Staff Selection */}
            <FormField
              control={form.control}
              name="staff_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign Staff</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a staff member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {staffList.map((s) => (
                        <SelectItem key={s.id} value={s.id.toString()}>
                          {s.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Client Name */}
            <FormField
              control={form.control}
              name="client_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. St. Mary's Hospital" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Timings */}
            <div className="grid grid-cols-1 gap-4">
              {/* START TIME */}
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date & Time</FormLabel>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* END TIME */}
              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date & Time</FormLabel>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Care St, Sydney" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bonus */}
            <FormField
              control={form.control}
              name="shift_bonus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shift Bonus ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-blue-600"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Shift
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
