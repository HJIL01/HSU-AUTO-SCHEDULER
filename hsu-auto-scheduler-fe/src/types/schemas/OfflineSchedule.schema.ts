import { WeekdayEnum } from "@/enums/weekday.enum";
import z from "zod";

export const OfflineScheduleSchema = z.object({
  day: z.enum(WeekdayEnum),

  start_time: z.number({
    message: "스케줄의 start time은 숫자여야 합니다",
  }),

  end_time: z.number({ message: "스케줄의 end time은 숫자여야 합니다" }),

  place: z
    .string({ message: "스케줄의 장소는 문자열이어야 합니다" })
    .optional(),
});

export type OfflineScheduleType = z.infer<typeof OfflineScheduleSchema>;
