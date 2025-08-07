import { GroupedOfflineScheduleByDay } from "@/types/groupedOfflineScheduleByDay.type";
import { OfflineScheduleType } from "@/types/schemas/OfflineSchedule.schema";

export default function groupOfflineScheduleByDay(
  offlineSchedules: OfflineScheduleType[],
): GroupedOfflineScheduleByDay {
  return offlineSchedules.reduce((acc, cur) => {
    const newOfflineSchedulesInCurDay = acc[cur.day] ?? [];

    newOfflineSchedulesInCurDay.push(cur);

    acc[cur.day] = newOfflineSchedulesInCurDay;

    return acc;
  }, {} as GroupedOfflineScheduleByDay);
}
