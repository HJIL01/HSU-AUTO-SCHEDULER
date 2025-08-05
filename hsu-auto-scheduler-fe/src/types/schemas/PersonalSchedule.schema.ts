import z from "zod";
import {
  createOfflineScheduleDefaultValue,
  offlineScheduleSchema,
} from "./OfflineSchedule.schema";

export const PersonalScheduleSchema = z.object({
  personal_schedule_id: z.string().min(1, "스케줄 ID는 필수입니다"),
  personal_schedule_name: z
    .string({
      message: "개인 스케줄의 이름은 필수 입력 항목입니다",
    })
    .min(1, { message: "개인 스케줄의 이름을 입력해주세요" }),

  offline_schedules: z.array(offlineScheduleSchema),
});

export type PersonalScheduleType = z.infer<typeof PersonalScheduleSchema>;

export function createPersonalScheduleDefaultValue(): PersonalScheduleType {
  return {
    personal_schedule_id: crypto.randomUUID(),
    personal_schedule_name: "",
    offline_schedules: [createOfflineScheduleDefaultValue()],
  };
}
