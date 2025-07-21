import { OfflineScheduleType } from "./schemas/OfflineScheduel.schema";

export type SessionInfoType = {
  online: number;
  offline_schedules: OfflineScheduleType[] | null;
};
