"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function TablePagination({
  pageCount,
  currentPage,
}: {
  pageCount: number;
  currentPage: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `/staff?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-end py-2 gap-4">
      {/* Sidebar-style Micro Label */}
      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
        Page {currentPage} <span className="mx-1 text-slate-300">/</span>{" "}
        {pageCount}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-3 text-[11px] font-semibold border-slate-200 hover:bg-slate-50 text-slate-600 gap-1"
          onClick={() => router.push(createPageUrl(currentPage - 1))}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-7 px-3 text-[11px] font-semibold border-slate-200 hover:bg-slate-50 text-slate-600 gap-1"
          onClick={() => router.push(createPageUrl(currentPage + 1))}
          disabled={currentPage >= pageCount}
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
