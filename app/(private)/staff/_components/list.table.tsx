"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { staff } from "@/generated/prisma/client";

interface ListTableProps {
  initialData: staff[]; // Use your Staff type here
}

export default function ListTable({ initialData }: ListTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Contact</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No staff found.
              </TableCell>
            </TableRow>
          ) : (
            initialData.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell className="font-medium">{staff.full_name}</TableCell>
                <TableCell>{staff.job_title}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      staff.status === "active" ? "default" : "secondary"
                    }
                  >
                    {staff.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {staff.email}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
