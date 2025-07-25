import { WeekdayEnum } from "@/enums/weekday.enum";
import { getOfflineScheduleInCurDay } from "./getOfflineScheduleInCurDay";
import { CourseType } from "@/types/schemas/Course.schema";
import { TIMETABLE_CELL_HEIGHT } from "@/constants/CourseCellHeight";

export function getCourseBlockHeight(course: CourseType, day: WeekdayEnum) {
  const targetOfflineSchedule = getOfflineScheduleInCurDay(course, day);

  const startTime = targetOfflineSchedule!.start_time;
  const endTime = targetOfflineSchedule!.end_time;

  const totalCourseTime = endTime - startTime;

  const courseBlockHeight = totalCourseTime * (TIMETABLE_CELL_HEIGHT / 60);

  return courseBlockHeight + 1;
}
