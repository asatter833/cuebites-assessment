// app/staff/_components/list.table.tsx
import { staff } from "@/generated/prisma/client";
import { columns } from "./column";
import { DataTable } from "./data-table";

interface ListTableProps {
  initialData: staff[];
  meta: {
    pageCount: number;
    currentPage: number;
    total: number;
  };
}

export default function ListTable({ initialData, meta }: ListTableProps) {
  return (
    <DataTable
      columns={columns}
      data={initialData}
      pageCount={meta.pageCount}
      currentPage={meta.currentPage}
      totalItems={meta.total} // Ensure meta.total is passed here
    />
  );
}
