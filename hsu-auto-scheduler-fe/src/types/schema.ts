import { WeekdayEnum } from "@/enums/weekday.enum";
import z from "zod";

export const schema = z.object({
  semester: z.string().min(1, { message: "학기를 선택해주세요!" }),
  major: z.string().min(1, { message: "전공을 선택해주세요!" }),
  grade: z
    .string()
    .min(1, { message: "학년을 입력해주세요!" })
    .max(4)
    .refine((e) => !isNaN(Number(e)), { message: "학년은 숫자만 입력" }),
  dayOrNight: z.string().min(1, { message: "주야 구분을 입력해주세요!" }),
  noClassDays: z.array(z.enum(WeekdayEnum)),
  maxCredit: z.preprocess(
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
  majorFoundation: z.preprocess(
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
  majorRequired: z.preprocess(
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
  majorElective: z.preprocess(
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
  dailyLectureLimit: z.preprocess(
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
  hasLunchBreak: z.boolean(),
});

export type SchemaType = z.infer<typeof schema>;

export const defaultValues: SchemaType = {
  semester: "2025-1",
  major: "",
  grade: "",
  dayOrNight: "",
  noClassDays: [WeekdayEnum.SAT, WeekdayEnum.SUN],
  maxCredit: 18,
  majorFoundation: 0,
  majorRequired: 0,
  majorElective: 0,
  dailyLectureLimit: 3,
  hasLunchBreak: false,
};
