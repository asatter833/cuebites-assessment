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

  const view = params.view || "table-view";

  // 1. Fetch data on the server
  const { data, meta } = await listStaff({
    search: params.search,
    page: Number(params.page) || 1,
  });
  console.log(data);
  return (
    <div className="mt-4">
      {/* 2. Pass data as props */}
      {view === "table-view" ? (
        <ListTable initialData={data} meta={meta} />
      ) : (
        <ListGrid initialData={data} />
      )}
    </div>
  );
}
