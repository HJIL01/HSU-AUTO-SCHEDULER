import z from "zod";
import { OfflineScheduleSchema } from "./OfflineScheduel.schema";

export const PersonalScheduleSchema = z.object({
  schedule_name: z
    .string({
      message: "개인 스케줄의 이름은 필수 입력 항목입니다",
    })
    .min(1, { message: "개인 스케줄의 이름을 입력해주세요" }),
  ...OfflineScheduleSchema.shape,
});

export type PersonalScheduleType = z.infer<typeof PersonalScheduleSchema>;
