"use client";

import CloseIcon from "@/assets/icons/CloseIcon";
import { COURSE_BLOCK_BG_COLORS } from "@/constants/CourseBlockBgColors";
import useUnmarkCourseSchedule from "@/hooks/useUnmarkCourseSchedule";
import { CourseRenderInfoType } from "@/types/courseRenderInfo.type";
import clsx from "clsx";
import { useState } from "react";

type Props = {
  courseRenderInfo: CourseRenderInfoType;
  isCPSATResult: boolean;
};

export default function CourseBlock({
  courseRenderInfo,
  isCPSATResult,
}: Props) {
  const isHoverEnabled = !isCPSATResult;
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { deleteCourseAndUnmark } = useUnmarkCourseSchedule();

  return (
    <div
      key={courseRenderInfo.courseId}
      className={clsx(
        "border-y-scheduler-cell-border absolute top-0 z-(--z-index-schedule-block) w-full overflow-hidden border-y max-md:p-2",
        COURSE_BLOCK_BG_COLORS[courseRenderInfo.colorIndex],
        isCPSATResult ? "p-2" : "p-4",
      )}
      style={{
        top: `${courseRenderInfo.top}px`,
        height: `${courseRenderInfo.height}px`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && isHoverEnabled && (
        <button
          className="float-right mt-2 mr-3 aspect-square w-7 bg-transparent max-md:w-5"
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
      <h2
        className={clsx(
          "max-md:text-xxs font-extrabold max-lg:text-xs",
          isCPSATResult ? "text-xxs" : "text-sm",
        )}
      >
        {courseRenderInfo.courseName}({courseRenderInfo.courseClassSection})
      </h2>

      <p
        className={clsx(
          "max-md:text-xxs max-md:flex-col",
          isCPSATResult ? "text-xxs" : "text-xs",
        )}
      >
        <em className="mr-1 font-semibold not-italic">
          {courseRenderInfo.professors.join(", ")}
        </em>
        <span>{courseRenderInfo.offlineSchedule?.place}</span>
      </p>
    </div>
  );
}
