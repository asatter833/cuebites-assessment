// app/staff/page.tsx (or wherever your list lives)

import ListGrid from "./_components/list.grid";
import ListTable from "./_components/list.table";

export default async function StaffPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; view?: string }>;
}) {
  const params = await searchParams;

  // 2. Define defaults
  // const search = params.search || "";
  const view = params.view || "table-view"; // This matches your component's default

  return (
    <div className="space-y-6">
      <div className="mt-4">
        {/* 3. Conditional Rendering based on URL state */}
        {view === "table-view" ? <ListTable /> : <ListGrid />}
      </div>
    </div>
  );
}
