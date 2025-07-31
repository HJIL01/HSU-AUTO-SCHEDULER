import { COURSE_BLOCK_BG_COLORS } from "@/constants/CourseBlockBgColors";
import {
  CourseRenderInfoType,
  SelectedCoursesRenderMapType,
} from "@/types/courseRenderInfo.type";
import { CourseType } from "@/types/schemas/Course.schema";
import { getTopByStartTime } from "./getTopByStartTime";
import { getCourseBlockHeight } from "./getCourseBlockHeight";

export default function groupCoursesByDay(courses: CourseType[]) {
  const groupedCoursesByDay: SelectedCoursesRenderMapType = courses.reduce(
    (acc, course, index) => {
      const baseInfo: CourseRenderInfoType = {
        courseId: course.course_id,
        courseName: course.course_name,
        courseClassSection: course.class_section,
        professors: course.professor_names,
        colorIndex: 0,
      };

      if (course.offline_schedules.length === 0) {
        const newNonTimes = acc.get("nontimes") ?? [];
        newNonTimes.push(baseInfo);
        acc.set("nontimes", newNonTimes);
      } else {
        course.offline_schedules.forEach((offlineSchedule) => {
          const day = offlineSchedule.day;

          const newCoursesInCurDay = acc.get(day) ?? [];

          newCoursesInCurDay.push({
            ...baseInfo,
            colorIndex: (index % (COURSE_BLOCK_BG_COLORS.length - 1)) + 1,
            offlineSchedule,
            top: getTopByStartTime(course, day, true),
            height: getCourseBlockHeight(course, day, true),
          });

          acc.set(day, newCoursesInCurDay);
        });
      }

      return acc;
    },
    new Map(),
  );

  return groupedCoursesByDay;
}
