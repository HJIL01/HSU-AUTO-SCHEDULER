import { WeekdayKorMap, WeekdayOrder } from "@/enums/weekday.enum";
import { OfflineScheduleType } from "@/types/schemas/OfflineSchedule.schema";
import { formatTimeString } from "./formatTimeString";

export function createOfflineScheduleString(
  offlineSchedules: OfflineScheduleType[],
) {
  const offlineScheduleFotmat = [...offlineSchedules]
    .sort((a, b) => WeekdayOrder[a.day] - WeekdayOrder[b.day])
    .map(
      (offlineSchedule) =>
        `${WeekdayKorMap[offlineSchedule.day]}요일: ${offlineSchedule.place} ${formatTimeString(offlineSchedule.start_time)}~${formatTimeString(offlineSchedule.end_time)}`,
    );

  return offlineScheduleFotmat.join("\n");
}
