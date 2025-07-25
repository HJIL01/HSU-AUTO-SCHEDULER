import { WeekdayEnum } from "@/enums/weekday.enum";
import { CourseType } from "@/types/schemas/Course.schema";

export function getOfflineScheduleInCurDay(
  course: CourseType,
  day: WeekdayEnum,
) {
  const offlineSchedules = course.offline_schedules;

  const targetOfflineSchedule = offlineSchedules.find((off) => off.day === day);

  return targetOfflineSchedule;
}
