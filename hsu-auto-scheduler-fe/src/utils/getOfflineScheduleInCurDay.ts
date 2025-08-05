import { CourseType } from "@/types/schemas/Course.schema";
import { PersonalScheduleType } from "@/types/schemas/PersonalSchedule.schema";

export function getOfflineScheduleInCurDay(
  target: CourseType | PersonalScheduleType,
  target_offline_schedule_id: string,
) {
  const offlineSchedules = target.offline_schedules;

  const targetOfflineSchedule = offlineSchedules.find(
    (off) => off.offline_schedule_id === target_offline_schedule_id,
  );

  return targetOfflineSchedule;
}
