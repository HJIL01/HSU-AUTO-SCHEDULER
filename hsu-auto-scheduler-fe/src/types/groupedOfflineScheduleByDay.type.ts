import { WeekdayEnum } from "@/enums/weekday.enum";
import { OfflineScheduleType } from "./schemas/OfflineSchedule.schema";

export type GroupedOfflineScheduleByDay = Record<
  WeekdayEnum,
  OfflineScheduleType[]
>;
