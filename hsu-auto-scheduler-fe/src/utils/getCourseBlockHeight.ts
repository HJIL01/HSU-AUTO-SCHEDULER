import { WeekdayEnum } from "@/enums/weekday.enum";
import { getOfflineScheduleInCurDay } from "./getOfflineScheduleInCurDay";
import { CourseType } from "@/types/schemas/Course.schema";
import getTimetableCellHeight from "./getTimetableCellHeight";

export function getCourseBlockHeight(
  course: CourseType,
  day: WeekdayEnum,
  isCPSATResult: boolean,
) {
  const timetableCellHeight = getTimetableCellHeight(isCPSATResult);

  const targetOfflineSchedule = getOfflineScheduleInCurDay(course, day);

  const startTime = targetOfflineSchedule!.start_time;
  const endTime = targetOfflineSchedule!.end_time;

  const totalCourseTime = endTime - startTime;

  const courseBlockHeight = totalCourseTime * (timetableCellHeight / 60);

  return courseBlockHeight + 1;
}
