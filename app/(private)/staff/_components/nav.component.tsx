"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { LayoutGrid, LayoutList, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Added
import { CreateStaffDialog } from "./create/create.staff";

function SearchInput({ className, ...props }: React.ComponentProps<"input">) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";
  const currentView = searchParams.get("view") ?? "table-view";
  const currentStatus = searchParams.get("status") ?? "all"; // Added

  const [value, setValue] = React.useState(currentSearch);

  // Sync input if URL changes (back button)
  React.useEffect(() => {
    setValue(currentSearch);
  }, [currentSearch]);

  // Unified URL Updater
  const updateQuery = React.useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, val]) => {
        if (val && val !== "all") {
          params.set(key, val);
        } else {
          params.delete(key);
        }
      });

      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // Debounced Search Update
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (value !== currentSearch) {
        updateQuery({ search: value });
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [value, currentSearch, updateQuery]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
      <div className="flex flex-wrap items-center gap-3 flex-1 w-full">
        {/* Search Field */}
        <div className="relative w-full max-w-xs">
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

        {/* View Toggle */}
        <ToggleGroup
          type="single"
          variant="outline"
          className="bg-background rounded-lg shadow-sm"
          value={currentView}
          onValueChange={(nextView) =>
            nextView && updateQuery({ view: nextView })
          }
        >
          <ToggleGroupItem value="card-view" className="h-9 w-9 px-0">
            <LayoutGrid className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="table-view" className="h-9 w-9 px-0">
            <LayoutList className="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        {/* Status Segmented Control */}
        <Tabs
          value={currentStatus}
          onValueChange={(val) => updateQuery({ status: val })}
          className="w-auto"
        >
          <TabsList className="h-9 shadow-sm border">
            <TabsTrigger value="all" className="text-xs px-4">
              All
            </TabsTrigger>
            <TabsTrigger value="active" className="text-xs px-4">
              Active
            </TabsTrigger>
            <TabsTrigger value="inactive" className="text-xs px-4">
              Inactive
            </TabsTrigger>
            <TabsTrigger value="terminated" className="text-xs px-4">
              Terminated
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <CreateStaffDialog />
    </div>
  );
}

export default function ListNavComponent(props: React.ComponentProps<"input">) {
  return (
    <React.Suspense
      fallback={
        <div className="h-10 w-full animate-pulse bg-muted rounded-md" />
      }
    >
      <SearchInput {...props} />
    </React.Suspense>
  );
}
