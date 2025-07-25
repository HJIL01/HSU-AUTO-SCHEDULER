"use client";

import { DayOrNightKorMap } from "@/enums/dayOrNight.enum";
import { useHSUStore } from "@/store/store";
import { CourseType } from "@/types/schemas/Course.schema";
import { createOfflineScheduleString } from "@/utils/createOfflineScheduleString";
import { useCallback } from "react";
import { useShallow } from "zustand/shallow";

type Props = {
  courseInfo: CourseType;
};

export default function CourseInfoTableRow({ courseInfo }: Props) {
  const { setHoveredCourse, clearHoveredCourse } = useHSUStore(
    useShallow((state) => ({
      hoveredCourse: state.hoveredCourse,
      setHoveredCourse: state.setHoveredCourse,
      clearHoveredCourse: state.clearHoveredCourse,
    })),
  );

  const setHover = useCallback(
    () => setHoveredCourse(courseInfo),
    [courseInfo, setHoveredCourse],
  );
  const clearHover = useCallback(
    () => clearHoveredCourse(),
    [clearHoveredCourse],
  );

  return (
    <tr
      className="bg-filter-courses-table-row-bg hover:bg-filter-courses-table-row-hover-bg cursor-pointer text-xs [&_td]:border [&_td]:border-t-0 [&_td]:py-3"
      onMouseEnter={setHover}
      onMouseLeave={clearHover}
    >
      <td> {`${courseInfo.course_code}-${courseInfo.class_section}`}</td>
      <td>{courseInfo.course_name}</td>
      <td>{courseInfo.professor_names.join(", ")}</td>
      <td>{courseInfo.grade === 0 ? "전학년" : courseInfo.grade}</td>
      <td>{courseInfo.grade_limit ? courseInfo.grade_limit : "-"}</td>
      <td>{courseInfo.completion_type}</td>
      <td>{courseInfo.delivery_method}</td>
      <td>{DayOrNightKorMap[courseInfo.day_or_night]}</td>
      <td className="whitespace-pre-line">
        {courseInfo.offline_schedules.length > 0
          ? createOfflineScheduleString(courseInfo.offline_schedules)
          : "-"}
      </td>
      <td>
        {courseInfo.plan_code !== "x" ? (
          <button
            onClick={() => {
              window.open(
                `https://info.hansung.ac.kr/fuz/professor/lecturePlan/suupplan_main_view.jsp?code=${courseInfo.plan_code}`,
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
