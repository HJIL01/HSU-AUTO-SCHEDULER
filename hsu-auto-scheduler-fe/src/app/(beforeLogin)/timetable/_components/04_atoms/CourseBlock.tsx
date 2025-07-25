"use client";

import { COURSE_BLOCK_BG_COLORS } from "@/constants/CourseBlockBgColors";
import { CourseRenderInfoType } from "@/types/courseRenderInfo.type";
import clsx from "clsx";

type Props = {
  courseRenderInfo: CourseRenderInfoType;
};

export default function CourseBlock({ courseRenderInfo }: Props) {
  return (
    <div
      key={courseRenderInfo.courseId}
      className={clsx(
        "border-y-scheduler-cell-border absolute top-0 z-30 w-full overflow-hidden border-y bg-amber-300 p-2",
        COURSE_BLOCK_BG_COLORS[courseRenderInfo.colorIndex],
      )}
      style={{
        top: `${courseRenderInfo.top}px`,
        height: `${courseRenderInfo.height}px`,
      }}
    >
      <h2 className="text-xs font-extrabold">{courseRenderInfo.courseName}</h2>
      <h4 className="font-semibold">
        {courseRenderInfo.professors.join(", ")}
      </h4>
      <span>{courseRenderInfo.offlineSchedule?.place}</span>
    </div>
  );
}
