"use client";

import { DAYS } from "@/constants/days";
import { HOURS } from "@/constants/hours";
import clsx from "clsx";
import DayColumn from "../../04_atoms/Timetable/DayColumn";
import {
  HoverCourseByDayType,
  SelectedCoursesByDayType,
} from "@/types/courseRender.type";
import getTimetableCellHeight from "@/utils/getTimetableCellHeight";
import TimetableHead from "./TimetableHead";
import { PersonalSchedulesByDayType } from "@/types/personalScheduleRender.type";

type Props = {
  hoveredCourseByDay?: HoverCourseByDayType;
  selectedCoursesByDay?: SelectedCoursesByDayType;
  personalSchedulesByDay?: PersonalSchedulesByDayType;
  isCPSATResult: boolean;
};

export default function TimeTableGrid({
  hoveredCourseByDay,
  selectedCoursesByDay,
  personalSchedulesByDay,
  isCPSATResult,
}: Props) {
  const timetableCellHeight = getTimetableCellHeight(isCPSATResult);
  return (
    <div
      className={clsx(
        !isCPSATResult &&
          (selectedCoursesByDay?.["nontimes"] ? "pb-10" : "pb-20"),
      )}
    >
      {/* thead */}
      {!isCPSATResult && <TimetableHead isCPSATResult={isCPSATResult} />}

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
                    "flex items-center justify-center text-xs",
                    i !== 0 && "border-timetable-cell-border border-t",
                  )}
                  style={{
                    height: timetableCellHeight,
                  }}
                >
                  {hour}:00
                </div>
              ))}
            </th>
            {DAYS.map((day) => (
              <DayColumn
                key={day}
                day={day}
                hoveredCourseInCurDay={hoveredCourseByDay?.[day]}
                coursesInCurDay={selectedCoursesByDay?.[day]}
                personalSchedulesInCurDay={personalSchedulesByDay?.[day]}
                isCPSATResult={isCPSATResult}
                timetableCellHeight={timetableCellHeight}
              />
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
