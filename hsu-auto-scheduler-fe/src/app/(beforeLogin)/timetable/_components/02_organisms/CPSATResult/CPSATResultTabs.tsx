"use client";

import { CPSATSolutionType } from "@/types/CPSATSolution.type";
import { useState } from "react";
import CPSATResultTabChanger from "./CPSATResultTabChanger";
import ChevronRight from "@/assets/icons/chevron-right";
import useGetCPSATResults from "@/hooks/queries/useGetCPSATResults";
import { CPSAT_RESULT_PER_PAGE } from "@/constants/CPSATResultPerPage";
import CPSATResultTimetableTab from "./tabs/CPSATResultTimetableTab";
import OnlineCourseList from "../../03_molecules/Timetable/OnlineCourseList";
import CPSATResultInfoSummaryTab from "./tabs/CPSATResultInfoSummaryTab";
import CPSATResultPaginationControls from "../../03_molecules/CPSATResult/CPSATResultPaginationControls ";
import CPSATResultTabRenderer from "../../03_molecules/CPSATResult/CPSATResultTabRenderer";

type Props = {
  CPSATResult: CPSATSolutionType[];
  totalSolutionCount: number;
};

export default function CPSATResultTabsContainer({
  CPSATResult,
  totalSolutionCount,
}: Props) {
  const [tabMode, setTabMode] = useState<
    "timetableMode" | "onlineLectureMode" | "infoSummaryMode"
  >("timetableMode");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const { fetchNextPage } = useGetCPSATResults();

  const onPrev = () => {
    if (currentIndex === 0) {
      return;
    }

    setCurrentIndex((prev) => prev - 1);
  };

  const onNext = () => {
    if (currentIndex === totalSolutionCount - 1) {
      return;
    }

    if (currentIndex === CPSAT_RESULT_PER_PAGE - 2) {
      fetchNextPage();
    }

    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div
      className="relative"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <CPSATResultPaginationControls
        currentIndex={currentIndex}
        totalSolutionCount={totalSolutionCount}
        onPrev={onPrev}
        onNext={onNext}
      />
      <div className="bg-course-finder-main-bg text-md absolute top-0 left-0 translate-y-[-98%] rounded-t-lg px-5 py-3 select-none">
        추천 시간표 {currentIndex + 1} / {totalSolutionCount}
      </div>

      <CPSATResultTabRenderer
        tabMode={tabMode}
        CPSATResult={CPSATResult}
        currentIndex={currentIndex}
      />

      <CPSATResultTabChanger tabMode={tabMode} setTabMode={setTabMode} />
    </div>
  );
}
