import { OfflineScheduleType } from "./schemas/OfflineSchedule.schema";

export type SessionInfoType = {
  online: number;
  offline_schedules: OfflineScheduleType[] | null;
};
