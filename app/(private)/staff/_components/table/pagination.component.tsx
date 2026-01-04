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
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="text-sm text-muted-foreground mr-4">
        Page {currentPage} of {pageCount}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(createPageUrl(currentPage - 1))}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(createPageUrl(currentPage + 1))}
        disabled={currentPage >= pageCount}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
