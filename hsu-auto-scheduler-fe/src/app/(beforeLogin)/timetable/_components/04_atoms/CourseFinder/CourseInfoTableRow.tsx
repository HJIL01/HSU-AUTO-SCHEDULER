"use client";

import { DayOrNightKorMap } from "@/enums/dayOrNight.enum";
import useMarkCourseSchedule from "@/hooks/useMarkCourseSchedule";
import { useTimetableStore } from "@/store/timetable/timetableStore";
import { CourseType } from "@/types/schemas/Course.schema";
import { createOfflineScheduleString } from "@/utils/createOfflineScheduleString";
import clsx from "clsx";
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
      className={clsx(
        "cursor-pointer bg-white text-xs",
        "hover:bg-course-finder-courses-table-row-hover-bg",
      )}
      onMouseEnter={() => setHoveredCourse(course)}
      onMouseLeave={clearHoveredCourse}
      onClick={() => onClickCourse(course)}
    >
      <td>
        <span className="text-hsu bg-hsu/20 rounded-lg p-3 font-semibold">{`${course.course_code}-${course.class_section}`}</span>
      </td>

      <td className="text-hsu font-semibold">{course.course_name}</td>

      <td className="font-medium text-[#495057]">
        {course.professor_names.join(", ")}
      </td>

      <td className="bg-hsu/20 text-hsu font-semibold">
        {course.grades
          .map((grade) => (grade === 0 ? "전학년" : grade))
          .join("/")}
      </td>

      <td className="text-course-info-text-base-gray font-medium">
        {course.grade_limit ? course.grade_limit : "-"}
      </td>

      <td className="bg-hsu/20 text-hsu font-semibold">{course.credit}</td>

      <td className="text-course-info-text-base-gray font-medium">
        {course.delivery_method}
      </td>

      <td className="text-course-info-text-base-gray font-medium">
        {course.completion_types.join("/")}
      </td>

      <td className="bg-hsu/20 text-hsu font-semibold">
        {DayOrNightKorMap[course.day_or_night]}
      </td>

      <td className="text-course-info-text-base-gray font-medium whitespace-pre-line">
        <span className="text-hsu font-semibold">
          {course.online_hour > 0 && `온라인강좌: ${course.online_hour}시간\n`}
        </span>
        {course.delivery_method !== "온라인100%" &&
          (course.offline_schedules.length > 0
            ? createOfflineScheduleString(course.offline_schedules)
            : "-")}
      </td>

      <td>
        {course.plan_code !== "x" ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(
                `https://info.hansung.ac.kr/fuz/professor/lecturePlan/suupplan_main_view.jsp?code=${course.plan_code}`,
                "_blank",
                "width=1000,height=800,top=0,left=500",
              );
              clearHoveredCourse();
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
