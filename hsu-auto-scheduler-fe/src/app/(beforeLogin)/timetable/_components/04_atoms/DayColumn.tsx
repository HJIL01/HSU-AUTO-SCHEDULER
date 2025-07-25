"use client";

import { WeekdayEnum } from "@/enums/weekday.enum";
import clsx from "clsx";
import { HOURS } from "@/constants/hours";
import { TIMETABLE_CELL_HEIGHT } from "@/constants/CourseCellHeight";
import { CourseRenderInfoType } from "@/types/courseRenderInfo.type";
import CourseBlock from "./CourseBlock";

type Props = {
  day: WeekdayEnum;
  coursesInCurDay?: CourseRenderInfoType[];
  hoveredCourseInCurDay?: CourseRenderInfoType;
};

export default function DayColumn({
  day,
  coursesInCurDay,
  hoveredCourseInCurDay,
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
            height: `${TIMETABLE_CELL_HEIGHT}px`,
          }}
        />
      ))}

      {coursesInCurDay &&
        coursesInCurDay.map((courseInCurDay, i) => (
          <CourseBlock key={i} courseRenderInfo={courseInCurDay} />
        ))}

      {hoveredCourseInCurDay && (
        <CourseBlock courseRenderInfo={hoveredCourseInCurDay} />
      )}
    </td>
  );
}
