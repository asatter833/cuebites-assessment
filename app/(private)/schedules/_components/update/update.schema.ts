import { z } from "zod";

export const updateScheduleSchema = z
  .object({
    staff_id: z
      .number({ message: "Please select a staff member" })
      .int()
      .positive("A valid staff ID is required"),
    client_name: z.string().min(1, "Client name is required"),
    start_time: z.date({ message: "Start time is required" }),
    end_time: z.date({ message: "End time is required" }),
    address: z.string().min(5, "Service address is required"),
    shift_bonus: z.number().nonnegative().optional(),
    remarks: z.string().optional().nullable(),
  })
  .refine((data) => data.end_time > data.start_time, {
    message: "End time must be after the start time",
    path: ["end_time"],
  });

export type UpdateScheduleType = z.infer<typeof updateScheduleSchema>;
