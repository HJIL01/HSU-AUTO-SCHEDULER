import { WeekdayEnum } from "@/enums/weekday.enum";
import { CourseType } from "@/types/course.type";
import { getOfflineScheduleInCurDay } from "./getOfflineScheduleInCurDay";
import { COURSE_CELL_HEIGHT } from "@/constants/CourseCellHeight";

export function getTopByStartTime(course: CourseType, day: WeekdayEnum) {
  const targetOfflineSchedule = getOfflineScheduleInCurDay(course, day);

  const startTime = targetOfflineSchedule!.start_time;

  /* 
    1. 강의 시작 시간에서 9시(540분)을 빼서 몇 시 시작인지 구하기(분 기준)
    2. 1분 당 몇 px인지 구하고, 위에서 구한 (분 * 1분당 px: 셀 하나의 높이 / 60분)을 하면 top을 구할 수 있음
  */
  const offsetTop = (startTime - 9 * 60) * (COURSE_CELL_HEIGHT / 60);

  return offsetTop;
}
