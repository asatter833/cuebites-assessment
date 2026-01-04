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

  const currentStatus = params.status === "all" ? undefined : params.status;

  // 1. Fetch data on the server - include the status here!
  const { data, meta } = await listStaff({
    search: params.search,
    status: currentStatus,
    page: Number(params.page) || 1,
  });
  return (
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
