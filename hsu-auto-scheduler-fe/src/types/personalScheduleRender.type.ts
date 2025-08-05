import { WeekdayEnum } from "@/enums/weekday.enum";
import { OfflineScheduleType } from "./schemas/OfflineSchedule.schema";

export type PersonalSchedulesByDayType = Partial<
  Record<WeekdayEnum, PersonalScheduleRenderInfoType[]>
>;

export type PersonalScheduleRenderInfoType = {
  personalScheduleId: string;
  personalScheduleName: string;
  offlineSchedule: OfflineScheduleType;
  colorIndex: number;
  top: number;
  height: number;
};
