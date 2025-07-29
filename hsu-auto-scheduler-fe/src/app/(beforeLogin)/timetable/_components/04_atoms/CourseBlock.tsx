"use client";

import CloseIcon from "@/assets/icons/CloseIcon";
import { COURSE_BLOCK_BG_COLORS } from "@/constants/CourseBlockBgColors";
import useUnmarkCourseSchedule from "@/hooks/useUnmarkCourseSchedule";
import { CourseRenderInfoType } from "@/types/courseRenderInfo.type";
import clsx from "clsx";
import { useState } from "react";

type Props = {
  courseRenderInfo: CourseRenderInfoType;
  isCPSATResult?: boolean;
};

export default function CourseBlock({
  courseRenderInfo,
  isCPSATResult,
}: Props) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { deleteCourseAndUnmark } = useUnmarkCourseSchedule();

  return (
    <div
      key={courseRenderInfo.courseId}
      className={clsx(
        "border-y-scheduler-cell-border absolute top-0 z-(--z-index-schedule-block) w-full overflow-hidden border-y p-2",
        COURSE_BLOCK_BG_COLORS[courseRenderInfo.colorIndex],
      )}
      style={{
        top: `${courseRenderInfo.top}px`,
        height: `${courseRenderInfo.height}px`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && !isCPSATResult && (
        <button
          className="float-right mt-2 mr-3 w-7 bg-transparent"
          onClick={() =>
            deleteCourseAndUnmark(
              courseRenderInfo.courseId,
              courseRenderInfo.courseName,
              courseRenderInfo.courseClassSection,
            )
          }
        >
          <CloseIcon />
        </button>
      )}
      <h2 className="text-sm font-extrabold max-md:text-xs">
        {courseRenderInfo.courseName}({courseRenderInfo.courseClassSection})
      </h2>

      <h4 className="text-xs font-semibold">
        {courseRenderInfo.professors.join(", ")}
      </h4>
      <span>{courseRenderInfo.offlineSchedule?.place}</span>
    </div>
  );
}
