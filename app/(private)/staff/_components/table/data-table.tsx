"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CreateStaffDialog } from "../create/create.staff";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  currentPage: number;
  totalItems: number; // Added to track total records
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  currentPage,
  totalItems,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable(
    React.useMemo(
      () => ({
        data,
        columns,
        state: {
          rowSelection,
        },
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
      }),
      [data, columns, rowSelection]
    )
  );

  const handlePageChange = (step: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", (currentPage + step).toString());
    router.push(`/staff?${params.toString()}`);
  };

  // Logic to calculate showing range (e.g., Showing 1-10 of 50)
  const pageSize = 10; // This should match your server-side limit
  const startRange = data.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endRange = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="space-y-2">
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-6 py-2 h-10">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-1">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center justify-center py-20 gap-4 bg-muted/10">
                    <div className="text-center space-y-1">
                      <h3 className="font-semibold text-lg tracking-tight">
                        No staff members found
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Get started by creating your staff member.
                      </p>
                    </div>
                    <CreateStaffDialog />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        {/* Updated section: Showing 1-10 of 50 staff */}
        <div className="flex-1 text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{startRange}</span> to{" "}
          <span className="font-medium text-foreground">{endRange}</span> of{" "}
          <span className="font-medium text-foreground">{totalItems}</span>{" "}
          staff
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4">
          <div className="flex items-center justify-center text-sm font-medium">
            Page {currentPage} of {pageCount}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageChange(-1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageChange(1)}
              disabled={currentPage >= pageCount}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
