"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { staff } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";
import { DeleteStaffButton } from "../delete.button";

const nationalityToCode: Record<string, string> = {
  american: "us",
  bangladesh: "bd",
  british: "gb",
  canadian: "ca",
  french: "fr",
  german: "de",
  indian: "in",
  japanese: "jp",
};

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
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={status === "active" ? "default" : "secondary"}
          className="capitalize"
        >
          {status}
        </Badge>
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
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-yellow-500"
            onClick={() => console.log("Toggle favourite", staffMember.id)}
          >
            <Star
              className={cn(
                "h-4 w-4",
                staffMember.is_favourite && "fill-yellow-500 text-yellow-500"
              )}
            />
          </Button>
          <DeleteStaffButton
            id={staffMember.id}
            staffName={staffMember.full_name}
          />
        </div>
      );
    },
  },
];
