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
  maxCredit: z
    .number()
    .min(1, { message: "최솟값은 1학점 이상이어야 합니다." })
    .max(21, { message: "최대 학점은 21학점입니다." }),
  majorFoundation: z
    .number()
    .min(0, { message: "0 미만의 값은 입력할 수 없습니다" })
    .max(21),
  majorRequired: z
    .number()
    .min(0, { message: "0 미만의 값은 입력할 수 없습니다" })
    .max(21),
  majorElective: z
    .number()
    .min(0, { message: "0 미만의 값은 입력할 수 없습니다" })
    .max(21),
  dailyLectureLimit: z.number().min(1),
  hasLunchBreak: z.boolean(),
});

export type SchemaType = z.infer<typeof schema>;

export const defaultValues: SchemaType = {
  semester: "2025-1",
  major: "",
  grade: "",
  dayOrNight: "",
  noClassDays: [WeekdayEnum.FRI, WeekdayEnum.SUN],
  maxCredit: 18,
  majorFoundation: 0,
  majorRequired: 0,
  majorElective: 0,
  dailyLectureLimit: 3,
  hasLunchBreak: false,
};
