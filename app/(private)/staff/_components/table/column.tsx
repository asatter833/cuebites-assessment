"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { staff } from "@/generated/prisma/client";
import { DeleteStaffButton } from "../delete.button";
import { UpdateStaffDialog } from "../update/update.staff";
import { FavoriteToggle } from "../favourite.button";
import { cn, nationalityToCode } from "@/lib/utils";

export const columns: ColumnDef<staff>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "full_name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("full_name")}</div>
    ),
  },
  {
    accessorKey: "dob",
    header: "Date of Birth",
    cell: ({ row }) => {
      const date = row.getValue("dob") as Date;
      if (!date) {
        return (
          <span className="text-muted-foreground/50 text-xs font-semibold tracking-tight">
            N/A
          </span>
        );
      }
      // Formats date to a clean string: e.g., Jan 4, 1995
      return (
        <div className="text-sm">
          {new Intl.DateTimeFormat("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).format(new Date(date))}
        </div>
      );
    },
  },
  {
    accessorKey: "job_title",
    header: "Job Title",
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("gender")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "nationality",
    header: "Nationality",
    cell: ({ row }) => {
      const nationality = (
        row.getValue("nationality") as string
      )?.toLowerCase();
      const countryCode = nationalityToCode[nationality];

      return (
        <div className="flex items-center gap-2 capitalize">
          {countryCode ? (
            <img
              src={`https://flagcdn.com/w20/${countryCode}.png`}
              srcSet={`https://flagcdn.com/w40/${countryCode}.png 2x`}
              alt={`${nationality} flag`}
              className="w-5 h-3.5 rounded-sm object-cover"
            />
          ) : (
            <span className="text-muted-foreground/50 text-xs font-semibold tracking-tight">
              N/A
            </span>
          )}
          <span className="text-sm">{nationality}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status =
        (row.getValue("status") as string)?.toLowerCase() || "inactive";

      // Define styles mapping
      const config = {
        active: {
          dot: "bg-green-500",
          text: "text-green-600",
          bg: "bg-green-50",
        },
        inactive: {
          dot: "bg-slate-400",
          text: "text-slate-500",
          bg: "bg-slate-50",
        },
        terminated: {
          dot: "bg-red-500",
          text: "text-red-600",
          bg: "bg-red-50",
        },
      };

      const style = config[status as keyof typeof config] || config.inactive;

      return (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold border shrink-0",
            style.bg,
            style.text,
            status === "active"
              ? "border-green-200"
              : status === "terminated"
              ? "border-red-200"
              : "border-slate-200"
          )}
        >
          <div className={cn("size-1.5 rounded-full", style.dot)} />
          <span className="capitalize">{status}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const staffMember = row.original;
      return (
        <div className="flex items-center justify-end gap-1">
          <FavoriteToggle
            id={staffMember.id}
            isFavorite={staffMember.is_favourite}
            staffName={staffMember.full_name}
          />
          <DeleteStaffButton
            id={staffMember.id}
            staffName={staffMember.full_name}
          />
          <UpdateStaffDialog staff={staffMember} />
        </div>
      );
    },
  },
];
