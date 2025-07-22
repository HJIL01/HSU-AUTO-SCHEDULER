import { WeekdayEnum } from "@/enums/weekday.enum";
import z from "zod";
import { courseSchema } from "./Course.schema";
import { PersonalScheduleSchema } from "./PersonalSchedule.schema";

export const CreateCPSATschema = z.object({
  semester: z.string().min(1, { message: "학기를 선택해주세요!" }),
  major_code: z.string().min(1, { message: "전공을 선택해주세요!" }),
  grade: z
    .string()
    .min(1, { message: "학년을 입력해주세요!" })
    .max(4)
    .refine((e) => !isNaN(Number(e)), { message: "학년은 숫자만 입력" }),
  day_or_night: z.string().min(1, { message: "주야 구분을 입력해주세요!" }),
  no_class_days: z.array(z.enum(WeekdayEnum)),
  personal_schedules: z.array(PersonalScheduleSchema),
  selected_courses: z.array(courseSchema),
  max_credit: z.preprocess(
    (val) => {
      if (typeof val === "string" || typeof val === "number") {
        return Number(val);
      }
      return val;
    },
    z
      .number()
      .min(0, { message: "0미만의 값은 입력할 수 없습니다" })
      .max(21, { message: "최대 학점은 21학점 미만입니다" }),
  ),
  major_foundation: z.preprocess(
    (val) => {
      if (typeof val === "string" || typeof val === "number") {
        return Number(val);
      }
      return val;
    },
    z
      .number()
      .min(0, { message: "0미만의 값은 입력할 수 없습니다" })
      .max(21, { message: "전공 기초는 21학점 미만입니다" }),
  ),
  major_required: z.preprocess(
    (val) => {
      if (typeof val === "string" || typeof val === "number") {
        return Number(val);
      }
      return val;
    },
    z
      .number()
      .min(0, { message: "0미만의 값은 입력할 수 없습니다" })
      .max(21, { message: "전공 필수는 21학점 미만입니다" }),
  ),
  major_elective: z.preprocess(
    (val) => {
      if (typeof val === "string" || typeof val === "number") {
        return Number(val);
      }
      return val;
    },
    z
      .number()
      .min(0, { message: "0미만의 값은 입력할 수 없습니다" })
      .max(21, { message: "전공 선택은 21학점 미만입니다" }),
  ),
  daily_lecture_limit: z.preprocess(
    (val) => {
      if (typeof val === "string" || typeof val === "number") {
        return +val;
      }

      return val;
    },
    z.number().min(1, {
      message: "하루 최대 강의 제한은 1미만의 값을 입력할 수 없습니다",
    }),
  ),
  has_lunch_break: z.boolean(),
});

export type CreateCPSATschemaType = z.infer<typeof CreateCPSATschema>;

export const createCPSATSchemaDefaultValues: CreateCPSATschemaType = {
  semester: "2025-2",
  major_code: "",
  grade: "",
  day_or_night: "",
  no_class_days: [WeekdayEnum.SAT, WeekdayEnum.SUN],
  personal_schedules: [],
  selected_courses: [],
  max_credit: 18,
  major_foundation: 0,
  major_required: 0,
  major_elective: 0,
  daily_lecture_limit: 3,
  has_lunch_break: false,
};
