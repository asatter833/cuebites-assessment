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
import { ChevronLeft, ChevronRight, UserRoundX } from "lucide-react";
import { CreateStaffDialog } from "../create/create.staff";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  currentPage: number;
  totalItems: number;
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

  const pageSize = 12;
  const startRange = data.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endRange = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/80">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-b border-slate-200"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-4 py-3 h-10 text-[10px] font-bold uppercase tracking-widest text-slate-500"
                  >
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
                  className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 py-2 text-sm font-medium text-slate-700"
                    >
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
                  className="h-72 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="p-4 bg-slate-50 rounded-full">
                      <UserRoundX className="size-10 text-slate-300" />
                    </div>
                    <div className="text-center space-y-1">
                      <h3 className="font-bold text-slate-900 tracking-tight">
                        No staff members found
                      </h3>
                      <p className="text-sm text-slate-500 max-w-xs mx-auto">
                        Your personnel directory is currently empty. Start by
                        adding a new team member.
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

      {/* Compact Pagination UI */}
      <div className="flex items-center justify-between px-2 py-1">
        <div className="flex-1 text-[11px] font-medium text-slate-500 uppercase tracking-tight">
          Showing{" "}
          <span className="text-slate-900 font-bold">
            {startRange}-{endRange}
          </span>{" "}
          of <span className="text-slate-900 font-bold">{totalItems}</span>{" "}
          personnel
        </div>

        <div className="flex items-center gap-4">
          <div className="text-[11px] font-bold text-slate-500 uppercase">
            Page {currentPage} <span className="mx-1 text-slate-300">/</span>{" "}
            {pageCount}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 border-slate-200 hover:bg-slate-50 text-slate-600"
              onClick={() => handlePageChange(-1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span className="sr-only">Previous</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 border-slate-200 hover:bg-slate-50 text-slate-600"
              onClick={() => handlePageChange(1)}
              disabled={currentPage >= pageCount}
            >
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
