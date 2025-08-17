import z from "zod";
import {
  createOfflineScheduleDefaultValue,
  offlineScheduleSchema,
} from "./OfflineSchedule.schema";
import { v7 as uuidv7 } from "uuid";

export const PersonalScheduleSchema = z.object({
  personal_schedule_id: z.uuidv7({ message: "유효한 uuid v7 형식이 아님" }),
  personal_schedule_name: z
    .string({
      message: "개인 스케줄의 이름은 필수 입력 항목입니다",
    })
    .refine((val) => val.trim().length > 0, {
      message: "개인 스케줄의 이름을 입력해주세요",
    }),

  offline_schedules: z.array(offlineScheduleSchema),
});

export type PersonalScheduleType = z.infer<typeof PersonalScheduleSchema>;

export function createPersonalScheduleDefaultValue(): PersonalScheduleType {
  return {
    personal_schedule_id: uuidv7(),
    personal_schedule_name: "",
    offline_schedules: [createOfflineScheduleDefaultValue()],
  };
}
