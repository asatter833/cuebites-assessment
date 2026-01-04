"use server";

import { createScheduleSchema } from "@/app/(private)/schedules/_components/create/create.schema";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSchedule(values: unknown) {
  // 1. Validate Input
  const validatedFields = createScheduleSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Validation failed",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { staff_id, start_time, end_time } = validatedFields.data;

  try {
    // 2. Check for Overlapping Shifts
    // This query finds any shift where the time ranges intersect
    const overlap = await prisma.schedules.findFirst({
      where: {
        staff_id: staff_id,
        OR: [
          {
            // Case 1: Existing shift starts during the new shift
            start_time: { gte: start_time, lte: end_time },
          },
          {
            // Case 2: Existing shift ends during the new shift
            end_time: { gte: start_time, lte: end_time },
          },
          {
            // Case 3: New shift is completely inside an existing shift
            start_time: { lte: start_time },
            end_time: { gte: end_time },
          },
        ],
      },
    });

    if (overlap) {
      return {
        success: false,
        error:
          "Conflict: This employee already has a shift scheduled during this time period.",
      };
    }

    // 3. Create the Schedule
    const schedule = await prisma.schedules.create({
      data: {
        client_name: validatedFields.data.client_name,
        start_time: validatedFields.data.start_time,
        end_time: validatedFields.data.end_time,
        address: validatedFields.data.address,
        shift_bonus: validatedFields.data.shift_bonus ?? 0,
        remarks: validatedFields.data.remarks,
        staff_id: validatedFields.data.staff_id,
      },
    });

    // 4. Revalidate cache to show new data immediately
    revalidatePath("/schedules");
    revalidatePath(`/staff/${staff_id}`);

    return { success: true, data: schedule };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "An unexpected database error occurred." };
  }
}
