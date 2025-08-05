import { WeekdayEnum } from "@/enums/weekday.enum";
import z from "zod";

export const CourseOfflineScheduleSchema = z.object({
  offline_schedule_id: z.number({
    message: "강의 스케줄의 아이디 값은 숫자여야 합니다",
  }),

  day: z.enum(WeekdayEnum),

  start_time: z.number({
    message: "스케줄의 start time은 숫자여야 합니다",
  }),

  end_time: z.number({ message: "스케줄의 end time은 숫자여야 합니다" }),

  place: z
    .string({ message: "스케줄의 장소는 문자열이어야 합니다" })
    .optional(),
});

export type CourseOfflineScheduleType = z.infer<
  typeof CourseOfflineScheduleSchema
>;
