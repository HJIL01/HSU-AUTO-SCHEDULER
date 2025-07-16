"use client";

import { days } from "@/constants/days";
import { hours } from "@/constants/hours";
import { WeekdayKorMap } from "@/enums/weekday.enum";
import DayColumn from "../_components/DayColumn";
import clsx from "clsx";

export default function Page() {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center gap-2 bg-amber-200">
      <table className="w-[80%] max-w-400 border [&_td]:border [&_th]:border">
        <thead className="text-sm">
          <tr className="h-25">
            <th className="w-30" />
            {days.map((day) => (
              <th key={day}>{WeekdayKorMap[day]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>
              {hours.map((hour, i) => (
                <div
                  key={hour}
                  className={clsx(
                    "flex h-30 items-center justify-center",
                    i !== 0 && "border-t",
                  )}
                >
                  {hour}시
                </div>
              ))}
            </th>
            {days.map((day) => (
              <DayColumn key={day} hours={hours} />
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
