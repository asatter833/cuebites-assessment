"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, Loader2, X } from "lucide-react";
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
  const [isPending, setIsPending] = React.useState(false);

  // Sync input with URL
  React.useEffect(() => {
    setValue(currentSearch);
  }, [currentSearch]);

  const updateQuery = React.useCallback(
    (val: string) => {
      setIsPending(true);
      const params = new URLSearchParams(searchParams.toString());
      if (val) {
        params.set("query", val);
      } else {
        params.delete("query");
      }
      router.push(`${pathname}?${params.toString()}`);

      // Small timeout to simulate transition finish
      setTimeout(() => setIsPending(false), 300);
    },
    [pathname, router, searchParams]
  );

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (value !== currentSearch) {
        updateQuery(value);
      }
    }, 400); // Slightly longer debounce for better UX
    return () => clearTimeout(timeout);
  }, [value, currentSearch, updateQuery]);

  return (
    <div className="relative group">
      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
        ) : (
          <Search className="h-3.5 w-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        )}
      </div>

      <Input
        {...props}
        type="text"
        placeholder="Filter staff..."
        className={cn(
          "pl-8 pr-8 h-8 w-[220px] bg-slate-100/50 border-slate-200 shadow-none",
          "text-[11px] font-bold uppercase tracking-tight placeholder:text-slate-400 placeholder:font-medium",
          "focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:bg-white transition-all",
          className
        )}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {value && (
        <button
          onClick={() => {
            setValue("");
            updateQuery("");
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-200 rounded-full transition-colors"
        >
          <X className="h-3 w-3 text-slate-500" />
        </button>
      )}
    </div>
  );
}

export default function ScheduleNav(props: React.ComponentProps<"input">) {
  return (
    <div className="flex items-center">
      <React.Suspense
        fallback={
          <div className="h-8 w-[220px] animate-pulse bg-slate-100 rounded-md border border-slate-200" />
        }
      >
        <ScheduleSearchInput {...props} />
      </React.Suspense>
    </div>
  );
}
