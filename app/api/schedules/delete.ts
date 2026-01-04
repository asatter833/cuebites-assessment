"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteSchedule(id: number) {
  try {
    await prisma.schedules.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/schedules");

    return {
      success: true,
      message: "Schedule deleted successfully",
    };
  } catch (error) {
    console.error("Delete Error:", error);

    // Handle cases where the record might have already been deleted
    return {
      success: false,
      error: "Failed to delete schedule. It may have already been removed.",
    };
  }
}
