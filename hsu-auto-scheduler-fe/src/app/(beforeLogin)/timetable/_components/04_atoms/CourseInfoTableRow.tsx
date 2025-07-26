"use client";

import { DayOrNightKorMap } from "@/enums/dayOrNight.enum";
import useMarkCourseSchedule from "@/hooks/useMarkCourseSchedule";
import { useTimetableStore } from "@/store/store";
import { CourseType } from "@/types/schemas/Course.schema";
import { createOfflineScheduleString } from "@/utils/createOfflineScheduleString";
import { useShallow } from "zustand/shallow";

type Props = {
  course: CourseType;
};

export default function CourseInfoTableRow({ course }: Props) {
  const { setHoveredCourse, clearHoveredCourse } = useTimetableStore(
    useShallow((state) => ({
      setHoveredCourse: state.setHoveredCourse,
      clearHoveredCourse: state.clearHoveredCourse,
    })),
  );

  const { onClickCourse } = useMarkCourseSchedule();

  return (
    <tr
      className="bg-filter-courses-table-row-bg hover:bg-filter-courses-table-row-hover-bg cursor-pointer text-xs [&_td]:border [&_td]:border-t-0 [&_td]:py-3"
      onMouseEnter={() => setHoveredCourse(course)}
      onMouseLeave={clearHoveredCourse}
      onClick={() => onClickCourse(course)}
    >
      <td> {`${course.course_code}-${course.class_section}`}</td>
      <td>{course.course_name}</td>
      <td>{course.professor_names.join(", ")}</td>
      <td>{course.grade === 0 ? "전학년" : course.grade}</td>
      <td>{course.grade_limit ? course.grade_limit : "-"}</td>
      <td>{course.completion_type}</td>
      <td>{course.delivery_method}</td>
      <td>{DayOrNightKorMap[course.day_or_night]}</td>
      <td className="whitespace-pre-line">
        {course.online_hour > 0 && `온라인강좌: ${course.online_hour}시간\n`}
        {course.offline_schedules.length > 0
          ? createOfflineScheduleString(course.offline_schedules)
          : "-"}
      </td>
      <td>
        {course.plan_code !== "x" ? (
          <button
            onClick={() => {
              window.open(
                `https://info.hansung.ac.kr/fuz/professor/lecturePlan/suupplan_main_view.jsp?code=${course.plan_code}`,
                "_blank",
                "width=1000,height=800,top=0,left=500",
              );
            }}
            className="bg-hsu rounded-3xl px-4 py-2 text-white"
          >
            조회
          </button>
        ) : (
          "-"
        )}
      </td>
    </tr>
  );
}
