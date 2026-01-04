import listStaff from "@/app/api/staff/list";
import ListGrid from "./_components/list.grid";
import ListTable from "./_components/list.table";
import { CreateStaffDialog } from "./(create)/create.staff";

export default async function StaffPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; view?: string; status?: string }>;
}) {
  const params = await searchParams;

  const search = params.search || "";
  const view = params.view || "table-view";
  const status = params.status || "";

  // 1. Fetch data on the server
  const { data: staffList, message } = await listStaff({
    search,
    status: status === "all" ? undefined : status,
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff Directory</h1>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        <CreateStaffDialog />
      </div>

      <div className="mt-4">
        {/* 2. Pass data as props */}
        {view === "table-view" ? (
          <ListTable initialData={staffList} />
        ) : (
          <ListGrid initialData={staffList} />
        )}
      </div>
    </div>
  );
}
