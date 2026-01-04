"use client";

import { staff } from "@/generated/prisma/client";
import { StaffCard } from "./grid.card";
import { CreateStaffDialog } from "../create/create.staff";
import { Users, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface ListTableProps {
  initialData: staff[];
}

export default function ListGrid({ initialData }: ListTableProps) {
  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* --- GRID CONTENT --- */}
      <div className="py-4 overflow-y-auto">
        {initialData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {initialData.map((member) => (
              <StaffCard key={member.id} staff={member} />
            ))}
          </div>
        ) : (
          /* --- THEMED EMPTY STATE --- */
          <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-slate-200 rounded-xl gap-6 bg-white/50 backdrop-blur-sm">
            <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shadow-inner">
              <Users className="size-8 text-slate-300" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                No Personnel Found
              </h3>
              <p className="text-[11px] font-medium text-slate-500 max-w-[240px] leading-relaxed uppercase tracking-tight">
                Your staff directory is currently empty. Start by onboarding
                your first member.
              </p>
            </div>
            <CreateStaffDialog />
          </div>
        )}
      </div>
    </div>
  );
}
