"use server";

import { createScheduleSchema } from "@/app/(private)/schedules/_components/create/create.schema";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSchedule(values: unknown) {
  const validatedFields = createScheduleSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Validation failed",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    staff_id,
    start_time,
    end_time,
    client_name,
    address,
    shift_bonus,
    remarks,
  } = validatedFields.data;

  try {
    // 1. Check for Overlapping Shifts
    // Mathematically: Overlap exists if (ExistingStart < NewEnd) AND (ExistingEnd > NewStart)
    const startTime = new Date(start_time);

    const endTime = new Date(end_time);

    // Check for overlapping schedules for the same staff

    const overlap = await prisma.schedules.findFirst({
      where: {
        staff_id: staff_id,

        OR: [
          {
            // New schedule starts during existing schedule

            start_time: { lt: endTime },

            end_time: { gt: startTime },
          },
        ],
      },
    });

    if (overlap) {
      return {
        success: false,
        error: `Conflict: This staff member is already assigned to "${overlap.client_name}" during this time.`,
      };
    }

    // 2. Create the Schedule
    const schedule = await prisma.schedules.create({
      data: {
        staff_id,
        client_name,
        address,
        start_time,
        end_time,
        shift_bonus: shift_bonus ?? 0,
        remarks,
      },
    });

    revalidatePath("/schedules");
    return { success: true, data: schedule };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "An unexpected database error occurred." };
  }
}
