import { WeekdayKorMap } from "@/enums/weekday.enum";
import { OfflineScheduleType } from "@/types/schemas/OfflineSchedule.schema";
import { formatMinToHour } from "./formatMinToHour";

export function createOfflineScheduleString(
  offlineSchedules: OfflineScheduleType[],
) {
  const offlineScheduleFotmat = offlineSchedules.map(
    (offlineSchedule) =>
      `${WeekdayKorMap[offlineSchedule.day]}요일: ${offlineSchedule.place} ${formatMinToHour(offlineSchedule.start_time)}~${formatMinToHour(offlineSchedule.end_time)}`,
  );

  return offlineScheduleFotmat.join("\n");
}
