"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import updateStaff from "@/app/api/staff/update";
import { UpdateStaffType } from "./update/update.schema";

interface FavoriteToggleProps {
  id: number;
  isFavorite: boolean;
  staffName?: string;
}

export function FavoriteToggle({
  id,
  isFavorite,
  staffName,
}: FavoriteToggleProps) {
  const [isPending, startTransition] = React.useTransition();
  // Optimistic UI state
  const [optimisticFavorite, setOptimisticFavorite] =
    React.useState(isFavorite);

  // Keep state in sync with server data
  React.useEffect(() => {
    setOptimisticFavorite(isFavorite);
  }, [isFavorite]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const nextValue = !optimisticFavorite;
    setOptimisticFavorite(nextValue);

    startTransition(async () => {
      const payload: Partial<UpdateStaffType> & { id: number } = {
        id,
        is_favourite: nextValue,
      };

      try {
        const result = await updateStaff(payload as UpdateStaffType);

        if (typeof result === "string") throw new Error(result);
        if (result && !result.success) throw new Error(result.error);
      } catch {
        setOptimisticFavorite(!nextValue);
        toast.error(`Error updating ${staffName || "staff"}`);
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={isPending}
      onClick={handleToggle}
      className={cn(
        "h-8 w-8 hover:bg-transparent transition-colors",
        optimisticFavorite ? "text-red-500" : "text-muted-foreground/40"
      )}
    >
      <Heart
        className={cn(
          "size-5 transition-transform",
          optimisticFavorite ? "fill-current scale-110" : "fill-none scale-100"
        )}
      />
      <span className="sr-only">Favorite</span>
    </Button>
  );
}
