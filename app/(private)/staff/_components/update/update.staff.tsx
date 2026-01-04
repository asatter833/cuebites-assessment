"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Pencil, UserCog } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { cn, nationalities } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import updateStaff from "@/app/api/staff/update";
import { gender } from "@/generated/prisma/enums";
import { updateStaffSchema, UpdateStaffType } from "./update.schema";
import { Separator } from "@/components/ui/separator";

interface UpdateStaffDialogProps {
  staff: {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    gender: gender;
    job_title: string;
    is_favourite: boolean;
    is_active: boolean;
    dob: Date | null;
    address: string | null;
    nationality: string | null;
    status: string | null;
  };
}

export function UpdateStaffDialog({ staff }: UpdateStaffDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const form = useForm<UpdateStaffType>({
    resolver: zodResolver(updateStaffSchema),
    defaultValues: {
      ...staff,
      status: staff.status ?? "active",
      address: staff.address ?? "",
      nationality: staff.nationality ?? "",
      dob: staff.dob ? new Date(staff.dob) : null,
    },
  });

  async function onSubmit(values: UpdateStaffType) {
    startTransition(async () => {
      const result = await updateStaff(values);

      if (typeof result === "string") {
        toast.error(result);
        return;
      }

      if (result?.success) {
        toast.success("Staff updated successfully");
        router.refresh();
        setOpen(false);
      } else {
        toast.error(result?.error || "Failed to update staff");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
        >
          <Pencil className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[460px] p-0 overflow-hidden border-slate-200 shadow-lg"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="p-4 bg-slate-50/80 border-b border-slate-200 space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white rounded-md border border-slate-200 shadow-sm">
              <UserCog className="size-4 text-blue-600" />
            </div>
            <DialogTitle className="text-base font-bold text-slate-900">
              Update Staff Member
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500 font-medium">
            Modify the profile and employment details for {staff.full_name}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-5 space-y-4"
          >
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Full Name<span className="text-destructive ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="h-9 focus-visible:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Email Address
                      <span className="text-destructive ml-0.5">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        className="h-9 focus-visible:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Phone Number
                      <span className="text-destructive ml-0.5">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-9 focus-visible:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="bg-slate-100 my-2" />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="job_title"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Job Title
                      <span className="text-destructive ml-0.5">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-9 focus-visible:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Gender<span className="text-destructive ml-0.5">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9 focus:ring-blue-500 w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={gender.male}>Male</SelectItem>
                        <SelectItem value={gender.female}>Female</SelectItem>
                        <SelectItem value={gender.nonBinary}>
                          Non-Binary
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Employment Status
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? "active"}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9 focus:ring-blue-500 w-full">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="terminated">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Date of Birth
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="h-9 focus:ring-blue-500"
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? new Date(e.target.value) : null
                          )
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Nationality
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-between h-9 font-normal text-sm",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? nationalities.find((n) => n.value === field.value)
                                ?.label
                            : "Select a country"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[240px] p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Search countries..."
                          className="h-8"
                        />
                        <CommandList className="max-h-[200px]">
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup>
                            {nationalities.map((n) => (
                              <CommandItem
                                key={n.value}
                                onSelect={() =>
                                  form.setValue("nationality", n.value, {
                                    shouldDirty: true,
                                  })
                                }
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    n.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {n.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
                className="h-8 text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isPending}
                className="h-8 text-xs font-semibold bg-blue-600 hover:bg-blue-700"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
