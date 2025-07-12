import { OfflineScheduleType } from "./offline-schedule.type";

export type SessionInfoType = {
  online: number;
  offline_schedules: OfflineScheduleType[] | null;
};
