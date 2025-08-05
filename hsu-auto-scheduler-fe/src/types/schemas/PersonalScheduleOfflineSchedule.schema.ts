import { WeekdayEnum } from "@/enums/weekday.enum";
import z from "zod";

export const personalScheduleOfflineScheduleSchema = z.object({
  offline_schedule_id: z
    .string()
    .min(1, { message: "오프라인 스케줄의 id는 필수입니다" }),

  day: z.enum(WeekdayEnum),

  start_time: z.number({
    message: "스케줄의 start time은 숫자여야 합니다",
  }),

  end_time: z.number({ message: "스케줄의 end time은 숫자여야 합니다" }),

  place: z
    .string({ message: "스케줄의 장소는 문자열이어야 합니다" })
    .optional(),
});

export type PersonalScheduleOfflineScheduleType = z.infer<
  typeof personalScheduleOfflineScheduleSchema
>;

export function createOfflineScheduleDefaultValue(): PersonalScheduleOfflineScheduleType {
  return {
    offline_schedule_id: crypto.randomUUID(),
    day: WeekdayEnum.MON,
    start_time: 540,
    end_time: 600,
    place: "",
  };
}
