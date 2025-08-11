// 모바일 전용 카드

"use client";

import { DayOrNightKorMap } from "@/enums/dayOrNight.enum";
import { CourseType } from "@/types/schemas/Course.schema";
import { createOfflineScheduleString } from "@/utils/createOfflineScheduleString";
import openLecturePlan from "@/utils/openLecturePlan";
import clsx from "clsx";

type Props = {
  course: CourseType;
  hoveredCourse: CourseType | null;
  handleClickCourseCard: (course: CourseType) => void;
  onAddCourse: (course: CourseType) => void;
};

export default function CourseInfoCard({
  course,
  hoveredCourse,
  handleClickCourseCard,
  onAddCourse,
}: Props) {
  return (
    <li
      className={clsx(
        "flex flex-col gap-5",
        "rounded-lg px-10 py-8",
        "cursor-pointer",
        hoveredCourse && hoveredCourse.course_id === course.course_id
          ? "bg-hsu/20"
          : "bg-linear-[135deg,var(--color-light-hsu)_0%,#fff_100%]",
      )}
      onClick={() => handleClickCourseCard(course)}
    >
      <div className="space-y-2">
        <h3 className={clsx("text-hsu-black-500 text-sm font-bold")}>
          {course.course_name}({course.class_section}) (
          {DayOrNightKorMap[course.day_or_night]})
        </h3>
        <span className={clsx("text-hsu-black-300 text-xs font-medium")}>
          {course.professor_names.join(", ")}
        </span>
      </div>
      <div className={clsx("text-hsu-black-300", "space-y-1")}>
        <p className="whitespace-pre">
          <span className="text-hsu font-semibold">
            {course.online_hour > 0 &&
              `온라인강좌: ${course.online_hour}시간\n`}
          </span>
          {course.delivery_method !== "온라인100%" &&
            (course.offline_schedules.length > 0
              ? createOfflineScheduleString(course.offline_schedules)
              : "-")}
        </p>
        <p className="space-x-4">
          <span>
            {course.grades
              .map((grade) => (grade === 0 ? "전학년" : `${grade}학년`))
              .join("/")}
          </span>
          <span>{course.completion_types.join("/")}</span>
          <span>{course.credit}학점</span>
          <span>{`${course.course_code}-${course.class_section}`}</span>
        </p>
        {course.grade_limit && (
          <span className="text-red-600">
            학년제한: {course.grade_limit}학년
          </span>
        )}
      </div>

      {hoveredCourse && hoveredCourse.course_id === course.course_id && (
        <div className="space-x-3">
          <button
            className={clsx(
              "w-fit px-4 py-2",
              "bg-hsu text-xxs text-white",
              "rounded-3xl",
            )}
            onClick={(e) => {
              e.stopPropagation();
              onAddCourse(course);
            }}
          >
            시간표에 추가
          </button>
          <button
            className={clsx(
              "w-fit px-4 py-2",
              "bg-hsu text-xxs text-white",
              "rounded-3xl",
            )}
            onClick={(e) => {
              e.stopPropagation();
              openLecturePlan(course.plan_code);
            }}
          >
            계획서 조회
          </button>
        </div>
      )}
    </li>
  );
}
