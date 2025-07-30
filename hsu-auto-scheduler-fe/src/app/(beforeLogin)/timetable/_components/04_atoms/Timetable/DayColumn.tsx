"use client";

import { WeekdayEnum } from "@/enums/weekday.enum";
import clsx from "clsx";
import { HOURS } from "@/constants/hours";
import { CourseRenderInfoType } from "@/types/courseRenderInfo.type";
import CourseBlock from "./CourseBlock";

type Props = {
  day: WeekdayEnum;
  coursesInCurDay?: CourseRenderInfoType[];
  hoveredCourseInCurDay?: CourseRenderInfoType;
  isCPSATResult: boolean;
  timetableCellHeight: number;
};

export default function DayColumn({
  day,
  coursesInCurDay,
  hoveredCourseInCurDay,
  isCPSATResult,
  timetableCellHeight,
}: Props) {
  return (
    <td data-day={day} className="relative">
      {HOURS.map((hour, i) => (
        <div
          key={hour}
          className={clsx(
            "min-w-20",
            i !== 0 && "border-scheduler-cell-border border-t",
          )}
          style={{
            height: `${timetableCellHeight}px`,
          }}
        />
      ))}

      {coursesInCurDay &&
        coursesInCurDay.map((courseInCurDay, i) => (
          <CourseBlock
            key={i}
            courseRenderInfo={courseInCurDay}
            isCPSATResult={isCPSATResult}
          />
        ))}

      {hoveredCourseInCurDay && (
        <CourseBlock
          courseRenderInfo={hoveredCourseInCurDay}
          isCPSATResult={isCPSATResult}
        />
      )}
    </td>
  );
}
