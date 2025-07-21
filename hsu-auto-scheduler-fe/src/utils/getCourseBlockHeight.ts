import { WeekdayEnum } from "@/enums/weekday.enum";
import { getOfflineScheduleInCurDay } from "./getOfflineScheduleInCurDay";
import { COURSE_CELL_HEIGHT } from "@/constants/CourseCellHeight";
import { CourseType } from "@/types/schemas/Course.schema";

export function getCourseBlockHeight(course: CourseType, day: WeekdayEnum) {
  const targetOfflineSchedule = getOfflineScheduleInCurDay(course, day);

  const startTime = targetOfflineSchedule!.start_time;
  const endTime = targetOfflineSchedule!.end_time;

  const totalCourseTime = endTime - startTime;

  const courseBlockHeight = totalCourseTime * (COURSE_CELL_HEIGHT / 60);

  return courseBlockHeight + 1;
}
