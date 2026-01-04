"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
import { Button } from "@/components/ui/button";
import deleteStaff from "@/app/api/staff/delete";
import { cn } from "@/lib/utils";

interface DeleteStaffButtonProps {
  id: number;
  staffName: string;
  className?: string;
  variant?: "icon" | "full";
}

export function DeleteStaffButton({
  id,
  staffName,
  className,
  variant = "icon",
}: DeleteStaffButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    setIsPending(async () => {
      const result = await deleteStaff(id);

      if (typeof result === "string") {
        toast.error(result);
        return;
      }

      if (result && typeof result === "object" && "success" in result) {
        if (result.success) {
          toast.success(`${staffName} deleted successfully`);
          router.refresh();
          setOpen(false);
        } else {
          const msg =
            "error" in result ? String(result.error) : "Failed to delete";
          toast.error(msg);
        }
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {variant === "icon" ? (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
              className
            )}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete {staffName}</span>
          </Button>
        ) : (
          <Button variant="destructive" className={cn("gap-2", className)}>
            <Trash2 className="h-4 w-4" />
            Delete Staff
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{" "}
            <span className="font-semibold text-foreground">{staffName}</span>{" "}
            and remove their data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="bg-red-400 text-destructive-foreground hover:bg-destructive/90"
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
