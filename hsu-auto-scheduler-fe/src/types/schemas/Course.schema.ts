import { DayOrNightEnum } from "@/enums/dayOrNight.enum";
import z from "zod";
import { OfflineScheduleSchema } from "./OfflineScheduel.schema";

export const courseSchema = z.object({
  semeter_id: z.string().min(1, { message: "학기를 선택해주세요!" }),

  course_id: z.string().min(1, { message: "course id는 필수값입니다" }),

  course_code: z.string().min(1, { message: "강의 코드는 필수값입니다" }),

  course_name: z.string().min(1, { message: "강의명은 필수값입니다" }),

  professor_names: z.array(
    z.string().min(1, { message: "professor name은 문자열이어야 합니다" }),
  ),
  completion_type: z.string().min(1, { message: "이수 구분은 필수값입니다" }),

  delivery_method: z.string().min(1, { message: "과목 구분은 필수값입니다" }),

  credit: z
    .number({ message: "학점은 숫자여야 합니다" })
    .min(1, { message: "학점의 최솟값은 1이상이어야 합니다" }),

  day_or_night: z.enum(DayOrNightEnum),

  class_section: z
    .string({ message: "분반은 문자열이어야 합니다" })
    .min(1, { message: "분반을 입력해주세요" }),

  grade: z.number({ message: "grade는 숫자여야 합니다." }),

  grade_limit: z.union([z.string().min(1), z.null()]).optional(),

  online_min: z.number({
    message: "온라인 시간은 숫자여야 합니다.",
  }),

  offline_schedules: z.union([z.array(OfflineScheduleSchema), z.null()]),

  plan_code: z.union([z.string().min(1), z.null()]),
});

export type CourseType = z.infer<typeof courseSchema>;
