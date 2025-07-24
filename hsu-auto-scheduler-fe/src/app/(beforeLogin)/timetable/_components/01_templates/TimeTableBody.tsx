"use client";

import { DAYS } from "@/constants/days";
import { HOURS } from "@/constants/hours";
import { WeekdayKorMap } from "@/enums/weekday.enum";
import useGetConstraintsResult from "@/hooks/queries/useGetConstraintsResult";
import { CPSAT_SolutionType } from "@/types/CP-SAT-Solution.type";
import { useState } from "react";
import clsx from "clsx";
import DayColumn from "../02_organisms/DayColumn";
import { useHSUStore } from "@/store/store";
import { useShallow } from "zustand/shallow";
import { motion } from "framer-motion";
import { COURSE_FINDER_HEIGHT } from "@/constants/CourseFinderHeight";

export default function TimeTableBody() {
  const [mockData, setMockData] = useState<CPSAT_SolutionType>();
  const { refetch } = useGetConstraintsResult();

  const getCPSATResult = async () => {
    const { data } = await refetch();
    setMockData(data.data.solutions.slice(0, 1)[0]);
  };

  const { isOpen, hoveredCourse } = useHSUStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      hoveredCourse: state.hoveredCourse,
    })),
  );

  return (
    <motion.div
      animate={{
        height: isOpen
          ? window.innerHeight * (COURSE_FINDER_HEIGHT / 100) + 52
          : "100%",
      }}
      transition={{
        duration: 1,
        ease: "easeInOut",
      }}
      className={clsx("relative w-full")}
    >
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

      <button
        className="fixed top-0 right-0 z-50 h-50 w-50 bg-red-500 text-2xl"
        onClick={getCPSATResult}
      >
        가져오기sadsad
      </button>
    </motion.div>
  );
}
