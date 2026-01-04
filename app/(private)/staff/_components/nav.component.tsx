"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { LayoutGrid, LayoutList, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CreateStaffDialog } from "./create/create.staff";

function SearchInput({ className, ...props }: React.ComponentProps<"input">) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";
  const currentView = searchParams.get("view") ?? "table-view";

  const [value, setValue] = React.useState(currentSearch);

  // Sync input if URL changes (back button)
  React.useEffect(() => {
    setValue(currentSearch);
  }, [currentSearch]);

  // Debounced Search Update
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (value === currentSearch) return;

      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      router.push(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timeout);
  }, [value, pathname, router, searchParams, currentSearch]);

  // Optimized View Switcher
  const handleViewChange = (nextView: string) => {
    // Prevent unselecting (ToggleGroup returns empty string if clicking active item)
    if (!nextView) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("view", nextView);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between w-full gap-4">
      <div className="flex items-center gap-2 flex-1 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            {...props}
            type="search"
            placeholder="Search staff..."
            className={cn("pl-8", className)}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <ToggleGroup
          type="single"
          variant="outline"
          value={currentView}
          onValueChange={handleViewChange}
        >
          <ToggleGroupItem value="table-view">
            <LayoutList className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="card-view">
            <LayoutGrid className="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <CreateStaffDialog />
    </div>
  );
}

export default function ListNavComponent(props: React.ComponentProps<"input">) {
  return (
    <React.Suspense
      fallback={
        <div className="h-10 w-full max-w-sm animate-pulse bg-muted rounded-md" />
      }
    >
      <SearchInput {...props} />
    </React.Suspense>
  );
}
