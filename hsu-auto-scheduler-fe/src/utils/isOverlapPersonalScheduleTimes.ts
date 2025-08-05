import { WeekdayEnum, WeekdayKorMap } from "@/enums/weekday.enum";
import { OfflineScheduleType } from "@/types/schemas/OfflineSchedule.schema";

export default function isOverlapPersonalScheduleTimes(
  groupedByDay: Record<WeekdayEnum, OfflineScheduleType[]>,
): boolean {
  for (const day in groupedByDay) {
    const schedulesInCurDay = [...groupedByDay[day as WeekdayEnum]].sort(
      (a, b) => a.start_time - b.start_time,
    );
    for (let i = 0; i < schedulesInCurDay.length - 1; i++) {
      if (schedulesInCurDay[i].end_time > schedulesInCurDay[i + 1].start_time) {
        alert(
          `현재 등록하려는 개인 스케줄의 ${WeekdayKorMap[day as WeekdayEnum]}요일에 겹치는 시간대가 존재합니다`,
        );
        return true;
      }
    }
  }

  return false;
}
