"use client";

import { CourseRenderInfoType } from "@/types/courseRender.type";
import clsx from "clsx";

type Props = {
  onlineCourses: CourseRenderInfoType[];
};

export default function CPSATResultOnlineCoursesTab({ onlineCourses }: Props) {
  return (
    <div className="h-full w-full p-5">
      {onlineCourses.length > 0 ? (
        <>
          {onlineCourses.map((onlineCourse, i) => (
            <div
              key={onlineCourse.courseId}
              className={clsx(
                "border-timetable-cell-border flex gap-2 border-b p-5",
              )}
            >
              <h2 className="inline-block text-sm font-extrabold">
                {i + 1}. {onlineCourse.courseName}(
                {onlineCourse.courseClassSection})
              </h2>
              <span className="max-lg:text-xxl flex items-center pt-[3px] text-xs max-md:text-[.8rem]">
                {onlineCourse.professors.join(", ")}
              </span>
            </div>
          ))}
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-2xl text-gray-400">
          온라인 강의가 없습니다
        </div>
      )}
    </div>
  );
}
