"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  ChevronsUpDown,
  Plus,
  UserPlus,
  Save,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "sonner";

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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Badge } from "@/components/ui/badge";

import {
  createStaffSchema,
  CreateStaffType,
} from "@/app/(private)/staff/_components/create/create.schema";
import createStaff from "@/app/api/staff/create";
import { gender } from "@/generated/prisma/enums";
import { useRouter } from "next/navigation";

export function CreateStaffDialog() {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [showExitAlert, setShowExitAlert] = React.useState(false);
  const [isPending, setIsPending] = React.useTransition();

  const form = useForm<CreateStaffType>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      email: "",
      job_title: "",
      gender: gender.male,
      is_favourite: false,
      is_active: true,
      status: "active",
      address: "",
      nationality: "",
      dob: undefined,
    },
  });

  const { isDirty } = form.formState;

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && isDirty) {
      setShowExitAlert(true);
      return;
    }
    if (!newOpen) form.reset();
    setOpen(newOpen);
  };

  const confirmExit = () => {
    form.reset();
    setShowExitAlert(false);
    setOpen(false);
  };

  async function onSubmit(values: CreateStaffType) {
    setIsPending(async () => {
      const result = await createStaff(values);
      if (result.success) {
        toast.success("Staff created successfully");
        form.reset();
        router.refresh();
        setOpen(false);
      } else {
        toast.error(result.error || "Failed to create staff");
      }
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm"
          >
            <Plus className="size-4" />
            Add Staff
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl"
          onPointerDownOutside={(e) => {
            if (isDirty) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (isDirty) e.preventDefault();
          }}
        >
          <DialogHeader className="p-6 pb-4 bg-slate-50 border-b relative">
            <div className="flex justify-between items-start mb-2">
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                Personnel Management
              </Badge>
            </div>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              Create New Staff
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Provide team member details to get started.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-6 space-y-4"
            >
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        className="bg-slate-50/50 "
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                          className="bg-slate-50/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1 234..."
                          {...field}
                          className="bg-slate-50/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="job_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
                        Job Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Software Engineer"
                          {...field}
                          className="bg-slate-50/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
                        Gender
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-slate-50/50 w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="nonBinary">Non-Binary</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
                        Nationality
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between font-normal bg-slate-50/50",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? nationalities.find(
                                    (n) => n.value === field.value
                                  )?.label
                                : "Select country"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search country..." />
                            <CommandList>
                              <CommandEmpty>Not found.</CommandEmpty>
                              <CommandGroup>
                                {nationalities.map((n) => (
                                  <CommandItem
                                    key={n.value}
                                    value={n.label}
                                    onSelect={() => {
                                      form.setValue("nationality", n.value, {
                                        shouldDirty: true,
                                      });
                                    }}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
                        Date of Birth
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="bg-slate-50/50"
                          {...field}
                          value={
                            field.value instanceof Date
                              ? field.value.toISOString().split("T")[0]
                              : field.value ?? ""
                          }
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? new Date(e.target.value)
                                : undefined
                            )
                          }
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
                    <FormLabel className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
                      Residential Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Street, City"
                        {...field}
                        value={field.value ?? ""}
                        className="bg-slate-50/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 flex flex-col gap-2">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 shadow-md"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isPending ? "Creating..." : "Save Personnel"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-slate-500"
                  onClick={() => handleOpenChange(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showExitAlert} onOpenChange={setShowExitAlert}>
        <AlertDialogContent className="max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <X className="h-5 w-5 text-red-500" />
              Discard changes?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Leaving will result in data loss.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="bg-slate-100">
              Keep Editing
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmExit}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
