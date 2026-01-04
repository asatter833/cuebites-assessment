"use client";

import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { format } from "date-fns";
import { z } from "zod";
import {
  Clock,
  MapPin,
  BadgeDollarSign,
  FileText,
  Calendar as CalendarIcon,
  Edit2,
  Trash2,
  X,
  Save,
} from "lucide-react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScheduleWithStaff } from "../page";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { UpdateScheduleType } from "./update/update.schema";
import { updateSchedule } from "@/app/api/schedules/update";
import { deleteSchedule } from "@/app/api/schedules/delete";

// Form type definitions
type ScheduleFormValues = {
  client_name: string;
  address: string;
  start_time: string;
  end_time: string;
  remarks: string;
  shift_bonus: number;
};

interface ScheduleDetailsSidebarProps {
  shift: ScheduleWithStaff | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleDetailsSidebar({
  shift,
  open,
  onOpenChange,
}: ScheduleDetailsSidebarProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const form = useForm<ScheduleFormValues>();

  // Reset form when shift changes or sidebar opens
  React.useEffect(() => {
    if (shift && open) {
      form.reset({
        client_name: shift.client_name,
        address: shift.address,
        start_time: format(new Date(shift.start_time), "yyyy-MM-dd'T'HH:mm"),
        end_time: format(new Date(shift.end_time), "yyyy-MM-dd'T'HH:mm"),
        remarks: shift.remarks || "",
        shift_bonus: Number(shift.shift_bonus),
      });
      setIsEditing(false);
    }
  }, [shift, open, form]);

  if (!shift) return null;

  const onSubmit: SubmitHandler<ScheduleFormValues> = async (data) => {
    const payload: UpdateScheduleType = {
      ...data,
      staff_id: shift.staff_id,
      start_time: new Date(data.start_time),
      end_time: new Date(data.end_time),
    };

    const res = await updateSchedule(shift.id, payload);
    if (res.success) {
      toast.success("Schedule updated");
      setIsEditing(false);
      onOpenChange(false);
    } else {
      toast.error(res.error || "Update failed");
    }
  };

  const handleDelete = async () => {
    const res = await deleteSchedule(shift.id);
    if (res.success) {
      toast.success("Shift deleted");
      onOpenChange(false);
    } else {
      toast.error("Delete failed");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md p-4 border-l shadow-2xl overflow-y-auto">
        <SheetHeader className="space-y-1 border border-slate-100 rounded-lg bg-slate-50 p-4 relative mb-6">
          <div className="flex justify-between items-start">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              {isEditing ? "Editing Mode" : "Shift Details"}
            </Badge>

            {/* ACTION ICONS */}
            <div className="flex items-center gap-1">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove this shift.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-400 hover:bg-red-500"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-blue-600"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Edit2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <SheetTitle className="text-2xl font-bold">
            {isEditing ? "Update Shift" : shift.client_name}
          </SheetTitle>
          {!isEditing && (
            <SheetDescription className="flex items-center text-slate-500">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              {shift.address}
            </SheetDescription>
          )}
        </SheetHeader>

        <div className="space-y-6">
          {!isEditing ? (
            /* --- VIEW MODE --- */
            <>
              {/* TIME SECTION */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Date</span>
                  </div>
                  <span className="font-semibold">
                    {format(new Date(shift.start_time), "EEEE, dd MMM yyyy")}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase text-slate-400 font-bold">
                      Start Time
                    </span>
                    <div className="flex items-center gap-2 font-mono text-lg font-bold">
                      <Clock className="h-4 w-4 text-blue-500" />
                      {format(new Date(shift.start_time), "HH:mm")}
                    </div>
                  </div>
                  <div className="h-8 w-px bg-slate-200" />
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-[10px] uppercase text-slate-400 font-bold">
                      End Time
                    </span>
                    <div className="flex items-center gap-2 font-mono text-lg font-bold justify-end">
                      {format(new Date(shift.end_time), "HH:mm")}
                      <Clock className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* STAFF SECTION */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Assigned Personnel
                </h4>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                    {shift.staff?.full_name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold">
                      {shift.staff?.full_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {shift.staff?.job_title}
                    </p>
                  </div>
                </div>
              </div>

              {/* FINANCE SECTION */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Financials
                </h4>
                <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50/30 border-green-100">
                  <div className="flex items-center gap-2 text-sm">
                    <BadgeDollarSign className="h-4 w-4 text-green-600" />
                    <span>Shift Bonus</span>
                  </div>
                  <span className="font-bold text-green-700">
                    ${Number(shift.shift_bonus).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* REMARKS */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Internal Remarks
                </h4>
                <div className="p-3 border rounded-lg bg-amber-50/20 border-amber-100 min-h-[80px]">
                  <div className="flex gap-2">
                    <FileText className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-600 italic">
                      {shift.remarks || "No remarks provided for this shift."}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* --- EDIT MODE --- */
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="client_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase">
                        Client Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="start_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase">
                          Start Time
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            className="text-xs"
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
                        <FormLabel className="text-xs font-bold uppercase">
                          End Time
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            className="text-xs"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase">
                        Location/Address
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel className="text-xs font-bold uppercase">
                        Remarks
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} className="resize-none h-24" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </form>
            </Form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
