import listStaff from "@/app/api/staff/list";
import ListGrid from "./_components/grid/grid.list";
import ListTable from "./_components/table/table.list";

export default async function StaffPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    view?: string;
    status?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;

  const view = params.view || "grid-view";

  // FIX 1: Handle the "all" case for status
  const currentStatus = params.status === "all" ? undefined : params.status;

  // 1. Fetch data on the server - include the status here!
  const { data, meta } = await listStaff({
    search: params.search,
    status: currentStatus, // <-- This was missing!
    page: Number(params.page) || 1,
  });

  return (
    // FIX 2: Adding a key based on params ensures the UI refreshes
    // when you click the filter tabs
    <div className="mt-4" key={JSON.stringify(params)}>
      {/* 2. Pass data as props */}
      {view === "table-view" ? (
        <ListTable initialData={data} meta={meta} />
      ) : (
        <ListGrid initialData={data} />
      )}
    </div>
  );
}
