import { WeekdayEnum } from "../enums/weekday.enum";

export type OfflineScheduleType = {
  day: WeekdayEnum;
  start_time: number;
  end_time: number;
  place: string;
};
