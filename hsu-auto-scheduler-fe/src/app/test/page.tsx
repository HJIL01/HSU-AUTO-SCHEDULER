"use client";

import { DAYS } from "@/constants/days";
import { HOURS } from "@/constants/hours";
import { WeekdayKorMap } from "@/enums/weekday.enum";
import DayColumn from "../_components/DayColumn";
import clsx from "clsx";
import useGetConstraintsResult from "@/hooks/queries/useGetConstraintsResult";
import { useState } from "react";
import { CPSAT_SolutionType } from "@/types/CP-SAT-Solution.type";
import CustomSelectBox from "@/components/ui/CustomSelectBox";

export default function Page() {
  const mock_semesters = ["2025-1, 2025-2"];
  const [mockData, setMockData] = useState<CPSAT_SolutionType>();
  const { refetch } = useGetConstraintsResult();

  const getCPSATResult = async () => {
    const { data } = await refetch();
    setMockData(data.data.solutions.slice(0, 1)[0]);
  };

  return (
    <main className="min-h-dvh w-full bg-amber-200">
      {/* <div className="flex gap-10">
        <div>학기: 드롭박스</div>
        <div>전공: 드롭박스</div>
        <div>학년: 드롭박스</div>
        <div>주야: 드롭박스</div>
        <div>공강요일: 셀렉트 박스</div>
        <div>최대 학점: 21학점 밑의 숫자 입력(디폴트 18)</div>
        <div>전공 기초: 21학점 밑의 숫자 입력(디폴트 0)</div>
        <div>전공 필수: 21학점 밑의 숫자 입력(디폴트 0)</div>
        <div>전공 선택: 21학점 밑의 숫자 입력(디폴트 0)</div>
        <div>하루 최대 강의 수: 숫자 입력 (디폴트 3)</div>
        <div>점심 보장: 불리언 (디폴트 false)</div>
      </div> */}

      <div className="h-max w-max">
        <CustomSelectBox<string> items={mock_semesters} name="semester_id" />
        <table className="w-[70dvw] max-w-400 border-collapse border [&_td]:border [&_th]:border">
          <thead className="text-sm">
            <tr className="h-25">
              <th className="w-30 min-w-15" />
              {DAYS.map((day) => (
                <th key={day}>{WeekdayKorMap[day]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>
                {HOURS.map((hour, i) => (
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
              {DAYS.map((day) => (
                <DayColumn
                  key={day}
                  day={day}
                  hours={HOURS}
                  coursesInCurDay={mockData?.selected_courses[day] ?? []}
                />
              ))}
            </tr>
          </tbody>
        </table>
        {mockData?.selected_courses.nontimes && (
          <div className="mt-5 text-sm">
            <h1 className="inline-block border border-b-0 p-3 text-base font-extrabold">
              온라인강의
            </h1>
            <ul className="border">
              {mockData?.selected_courses.nontimes.map((nontimeCourse, i) => (
                <li
                  key={nontimeCourse.course_id}
                  className={clsx(
                    "p-3",
                    i !== mockData?.selected_courses["nontimes"].length - 1 &&
                      "border-b",
                  )}
                >
                  <h2 className="inline-block font-semibold">
                    {nontimeCourse.course_name}
                  </h2>
                  <span> ({nontimeCourse.professor_names})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        className="absolute top-150 right-10 border p-1"
        onClick={getCPSATResult}
      >
        디버깅용 해 불러오기 버튼
      </button>
    </main>
  );
}
