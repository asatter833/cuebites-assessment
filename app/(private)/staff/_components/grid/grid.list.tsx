import { staff } from "@/generated/prisma/client";
import { StaffCard } from "./grid.card";
import { CreateStaffDialog } from "../create/create.staff";
interface ListTableProps {
  initialData: staff[];
}
export default function ListGrid({ initialData }: ListTableProps) {
  return (
    <div className=" mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {initialData.map((member) => (
          <StaffCard key={member.id} staff={member} />
        ))}
      </div>

      {initialData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-lg gap-4 bg-muted/10">
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
      )}
    </div>
  );
}
