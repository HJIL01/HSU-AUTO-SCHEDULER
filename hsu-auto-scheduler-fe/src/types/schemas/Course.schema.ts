import { DayOrNightEnum } from "@/enums/dayOrNight.enum";
import z from "zod";
import { offlineScheduleSchema } from "./OfflineSchedule.schema";

export const courseSchema = z.object({
  semester_id: z.string().min(1, { message: "학기를 선택해주세요!" }),

  course_id: z.string().min(1, { message: "course id는 필수값입니다" }),

  course_code: z.string().min(1, { message: "강의 코드는 필수값입니다" }),

  course_name: z.string().min(1, { message: "강의명은 필수값입니다" }),

  professor_names: z.array(
    z.string().min(1, { message: "professor name은 문자열이어야 합니다" }),
  ),
  completion_types: z.array(
    z.string().min(1, { message: "이수 구분은 필수값입니다" }),
    { message: "이수 구분은 배열이어야 합니다" },
  ),

  delivery_method: z.string().min(1, { message: "과목 구분은 필수값입니다" }),

  credit: z
    .number({ message: "학점은 숫자여야 합니다" })
    .min(1, { message: "학점의 최솟값은 1이상이어야 합니다" }),

  day_or_night: z.enum(DayOrNightEnum),

  class_section: z
    .string({ message: "분반은 문자열이어야 합니다" })
    .min(1, { message: "분반을 입력해주세요" }),

  grades: z.array(z.number({ message: "grade는 숫자여야 합니다." }), {
    message: "grades는 숫자의 배열이어야 합니다",
  }),

  grade_limit: z.union([z.number(), z.null()]).optional(),

  online_hour: z.number({
    message: "온라인 시간은 숫자여야 합니다.",
  }),

  offline_schedules: z.array(offlineScheduleSchema),

  plan_code: z.union([z.number(), z.null()]).optional(),
});

export type CourseType = z.infer<typeof courseSchema>;
