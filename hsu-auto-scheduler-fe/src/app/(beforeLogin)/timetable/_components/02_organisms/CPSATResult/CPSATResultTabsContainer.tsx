"use client";

import { CPSATSolutionType } from "@/types/CPSATSolution.type";
import { useState } from "react";
import CPSATResultTabChanger from "../../03_molecules/CPSATResult/CPSATResultTabChanger";
import useGetCPSATResults from "@/hooks/queries/useGetCPSATResults";
import { CPSAT_RESULT_PER_PAGE } from "@/constants/CPSATResultPerPage";
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

    const currentPage = currentIndex % CPSAT_RESULT_PER_PAGE;

    // 현재 페이지의 마지막 바로 이전 아이템일때 fetch(마지막일때 fetch하면 후처리 연산 때문에 렉걸림)
    if (currentPage === CPSAT_RESULT_PER_PAGE - 2) {
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
      <div className="bg-course-finder-main-bg text-md absolute top-0 left-0 -translate-y-full rounded-t-lg px-5 py-3 select-none">
        추천 시간표 {currentIndex + 1} / {totalSolutionCount}
      </div>
      <CPSATResultTabChanger
        tabMode={tabMode}
        setTabMode={setTabMode}
        onlineCourseCount={
          CPSATResult?.[currentIndex]?.total_online_course_count ?? 0
        }
      />

      <CPSATResultTabRenderer
        tabMode={tabMode}
        CPSATResult={CPSATResult}
        currentIndex={currentIndex}
      />
    </div>
  );
}
