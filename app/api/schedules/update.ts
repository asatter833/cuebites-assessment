"use server";

import { updateScheduleSchema } from "@/app/(private)/schedules/_components/update/update.schema";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type UpdateScheduleValues = z.infer<typeof updateScheduleSchema>;

export async function updateSchedule(id: number, values: UpdateScheduleValues) {
  try {
    // Conflict Check
    const overlap = await prisma.schedules.findFirst({
      where: {
        staff_id: values.staff_id,
        id: { not: id },
        AND: [
          { start_time: { lt: values.end_time } },
          { end_time: { gt: values.start_time } },
        ],
      },
    });

    if (overlap) {
      return { success: false, error: `Conflict with ${overlap.client_name}` };
    }

    const schedule = await prisma.schedules.update({
      where: { id },
      data: { ...values, shift_bonus: values.shift_bonus ?? 0 },
    });

    revalidatePath("/schedules");
    return { success: true, data: schedule };
  } catch (error) {
    return { success: false, error: "Failed to update schedule." };
  }
}
