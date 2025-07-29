"use client";

import { DAYS } from "@/constants/days";
import { HOURS } from "@/constants/hours";
import clsx from "clsx";
import DayColumn from "../04_atoms/DayColumn";
import { WeekdayKorMap } from "@/enums/weekday.enum";
import {
  HoverCourseRenderMapType,
  SelectedCoursesRenderMapType,
} from "@/types/courseRenderInfo.type";

type Props = {
  selectedCoursesByDay?: SelectedCoursesRenderMapType;
  hoveredCourseByDay?: HoverCourseRenderMapType;
  className?: string;
  isCPSATResult?: boolean;
};

export default function TimeTableGrid({
  selectedCoursesByDay,
  hoveredCourseByDay,
  className,
  isCPSATResult,
}: Props) {
  return (
    <div className={className}>
      {/* thead */}
      <table className="bg-timetable-body-bg w-full border text-sm">
        <colgroup>
          <col className="border-timetable-cell-border w-30 border" />
          {DAYS.map((day) => (
            <col key={day} className="border-timetable-cell-border border" />
          ))}
        </colgroup>

        <thead className="text-hsu">
          <tr className="h-25">
            <th />
            {DAYS.map((day) => (
              <th key={day}>{WeekdayKorMap[day]}</th>
            ))}
          </tr>
        </thead>
      </table>

      {/* tbody */}
      <table className="[&_td]:border-timetable-cell-border bg-timetable-body-bg [&_th]:border-timetable-cell-border w-full border text-sm [&_td]:border [&_th]:border">
        <colgroup>
          <col className="border-timetable-cell-border w-30 border" />
          {DAYS.map((day) => (
            <col key={day} className="border-timetable-cell-border border" />
          ))}
        </colgroup>

        <tbody>
          <tr>
            <th>
              {HOURS.map((hour, i) => (
                <div
                  key={hour}
                  className={clsx(
                    "flex h-30 items-center justify-center text-xs",
                    i !== 0 && "border-timetable-cell-border border-t",
                  )}
                >
                  {hour}:00
                </div>
              ))}
            </th>
            {DAYS.map((day) => (
              <DayColumn
                key={day}
                day={day}
                coursesInCurDay={selectedCoursesByDay?.get(day)}
                hoveredCourseInCurDay={hoveredCourseByDay?.get(day)}
                isCPSATResult={isCPSATResult}
              />
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
