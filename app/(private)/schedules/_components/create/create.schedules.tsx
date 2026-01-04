"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, MapPin, Save } from "lucide-react";
import { format } from "date-fns";

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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

import { staff } from "@/generated/prisma/client";
import { createScheduleSchema, CreateScheduleType } from "./create.schema";
import { createSchedule } from "@/app/api/schedules/create";

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
      // Initialize dates to now or empty strings depending on your schema
    },
  });

  async function onSubmit(values: CreateScheduleType) {
    setIsPending(true);
    // Ensure dates are sent as proper Date objects if your API expects them
    const result = await createSchedule({
      ...values,
      start_time: new Date(values.start_time),
      end_time: new Date(values.end_time),
    });
    setIsPending(false);

    if (result.success) {
      toast.success("Schedule created successfully");
      form.reset();
      setOpen(false);
    } else {
      toast.error(result.error || "Failed to create schedule");
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm transition-all">
          <Plus className="mr-2 h-4 w-4" /> Add New Shift
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-md p-4 border-l shadow-2xl overflow-y-auto">
        {/* MATCHED HEADER STYLE */}
        <SheetHeader className="space-y-1 border border-slate-100 rounded-lg bg-slate-50 p-4 mb-6">
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 w-fit"
          >
            New Assignment
          </Badge>
          <SheetTitle className="text-2xl font-bold">Create Shift</SheetTitle>
          <SheetDescription className="text-slate-500">
            Fill in the details below to assign a new shift.
          </SheetDescription>
        </SheetHeader>

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
                  <FormLabel className="text-[10px] font-bold uppercase text-slate-500">
                    Assign Personnel
                  </FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-slate-50/50 w-full">
                        <SelectValue placeholder="Select staff member" />
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
                  <FormLabel className="text-[10px] font-bold uppercase text-slate-500">
                    Client Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter client or hospital name"
                      {...field}
                      className="bg-slate-50/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Timings Grid */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase text-slate-500">
                      Start Time
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        value={
                          field.value
                            ? format(
                                new Date(field.value),
                                "yyyy-MM-dd'T'HH:mm"
                              )
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(new Date(e.target.value))
                        }
                        className="text-xs bg-slate-50/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase text-slate-500">
                      End Time
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        value={
                          field.value
                            ? format(
                                new Date(field.value),
                                "yyyy-MM-dd'T'HH:mm"
                              )
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(new Date(e.target.value))
                        }
                        className="text-xs bg-slate-50/50"
                      />
                    </FormControl>
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
                  <FormLabel className="text-[10px] font-bold uppercase text-slate-500">
                    Service Address
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Location address"
                        {...field}
                        className="pl-9 bg-slate-50/50"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bonus & Remarks */}
            <div className="grid grid-cols-1 gap-5">
              <FormField
                control={form.control}
                name="shift_bonus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase text-slate-500">
                      Shift Bonus ($)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="bg-slate-50/50"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase text-slate-500">
                      Internal Remarks
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes for staff..."
                        className="resize-none h-24 bg-slate-50/50"
                        {...field}
                        // ADD THIS LINE:
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col gap-3">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 shadow-md"
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Create Shift Assignment
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="w-full text-slate-500"
              >
                Discard
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
