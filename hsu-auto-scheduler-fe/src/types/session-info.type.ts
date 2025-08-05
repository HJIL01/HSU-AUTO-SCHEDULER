import { OfflineScheduleType } from "./schemas/PersonalScheduleOfflineSchedule.schema";

export type SessionInfoType = {
  online: number;
  offline_schedules: OfflineScheduleType[] | null;
};
