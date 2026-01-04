import { staff } from "@/generated/prisma/client";
import React from "react";
interface ListTableProps {
  initialData: staff[]; // Use your Staff type here
}
export default function ListGrid({ initialData }: ListTableProps) {
  return <div>ListGrid</div>;
}
