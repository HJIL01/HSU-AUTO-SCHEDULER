"use client";

import { days } from "@/constants/days";
import { hours } from "@/constants/hours";
import { WeekdayKorMap } from "@/enums/weekday.enum";
import DayColumn from "../_components/DayColumn";
import clsx from "clsx";
import useGetConstraintsResult from "@/hooks/queries/useGetConstraintsResult";
import { useState } from "react";
import { CPSAT_SolutionType } from "@/types/CP-SAT-Solution.type";

export default function Page() {
  const [mockData, setMockData] = useState<CPSAT_SolutionType>();
  const { refetch } = useGetConstraintsResult();

  const getCPSATResult = async () => {
    const { data } = await refetch();
    setMockData(data.data.solutions.slice(0, 1)[0]);
  };

  console.log(mockData);

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
              <DayColumn
                key={day}
                day={day}
                hours={hours}
                coursesInCurDay={mockData?.selected_courses[day] ?? []}
              />
            ))}
          </tr>
        </tbody>
      </table>

      <button className="border p-1" onClick={getCPSATResult}>
        디버깅용 해 불러오기 버튼
      </button>
    </div>
  );
}
