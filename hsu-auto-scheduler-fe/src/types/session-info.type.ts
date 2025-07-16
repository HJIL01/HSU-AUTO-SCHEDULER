import { OfflineScheduleType } from "./offlineSchedule.type";

export type SessionInfoType = {
  online: number;
  offline_schedules: OfflineScheduleType[] | null;
};
