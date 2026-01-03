"use server";

import { CreateStaffType } from "@/app/(private)/staff/schema.staff";

export default async function createStaff(params: CreateStaffType) {
  console.log(params);
}
