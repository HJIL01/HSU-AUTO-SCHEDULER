"use client";

import { DayOrNightKorMap } from "@/enums/dayOrNight.enum";
import { CourseType } from "@/types/schemas/Course.schema";
import { createOfflineScheduleString } from "@/utils/createOfflineScheduleString";

type Props = {
  courseInfo: CourseType;
};

export default function CourseInfoTableRow({ courseInfo }: Props) {
  return (
    <tr className="text-xs [&_td]:border [&_td]:py-3">
      <td> {`${courseInfo.course_code}-${courseInfo.class_section}`}</td>
      <td>{courseInfo.course_name}</td>
      <td>{courseInfo.professor_names}</td>
      <td>{courseInfo.grade === 0 ? "전학년" : courseInfo.grade}</td>
      <td>{courseInfo.grade_limit ? courseInfo.grade_limit : "-"}</td>
      <td>{courseInfo.completion_type}</td>
      <td>{courseInfo.delivery_method}</td>
      <td>{DayOrNightKorMap[courseInfo.day_or_night]}</td>
      <td className="whitespace-pre-line">
        {courseInfo.offline_schedules
          ? createOfflineScheduleString(courseInfo.offline_schedules!)
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
