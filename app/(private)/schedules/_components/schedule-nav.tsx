"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

function ScheduleSearchInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("query") ?? "";
  const [value, setValue] = React.useState(currentSearch);

  // Sync input with URL (e.g., on back button)
  React.useEffect(() => {
    setValue(currentSearch);
  }, [currentSearch]);

  const updateQuery = React.useCallback(
    (val: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (val) {
        params.set("query", val);
      } else {
        params.delete("query");
      }
      // Preserve the current date if it exists
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // Debounce search update
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (value !== currentSearch) {
        updateQuery(value);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [value, currentSearch, updateQuery]);

  return (
    <div className="relative w-full max-w-xs">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        {...props}
        type="search"
        placeholder="Search staff name..."
        className={cn("pl-8 h-9 bg-white shadow-sm", className)}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

export default function ScheduleNav(props: React.ComponentProps<"input">) {
  return (
    <React.Suspense
      fallback={<div className="h-9 w-64 animate-pulse bg-muted rounded-md" />}
    >
      <ScheduleSearchInput {...props} />
    </React.Suspense>
  );
}
