import { WeekdayEnum } from "@/enums/weekday.enum";
import z from "zod";
import { v7 as uuidv7 } from "uuid";

export const offlineScheduleSchema = z.object({
  offline_schedule_id: z.uuidv7({ message: "유효한 uuid v7 형식이 아님" }),

  day: z.enum(WeekdayEnum),

  start_time: z.number({
    message: "스케줄의 start time은 숫자여야 합니다",
  }),

  end_time: z.number({ message: "스케줄의 end time은 숫자여야 합니다" }),

  place: z
    .string({ message: "스케줄의 장소는 문자열이어야 합니다" })
    .optional(),
});

export type OfflineScheduleType = z.infer<typeof offlineScheduleSchema>;

export function createOfflineScheduleDefaultValue(): OfflineScheduleType {
  return {
    offline_schedule_id: uuidv7(),
    day: WeekdayEnum.MON,
    start_time: 540,
    end_time: 600,
    place: "",
  };
}
