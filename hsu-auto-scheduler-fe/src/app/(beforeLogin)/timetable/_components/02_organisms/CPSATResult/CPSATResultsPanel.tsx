"use client";

import { CPSATSolutionType } from "@/types/CPSATSolution.type";
import { useState } from "react";
import CPSATResultPaginationControls from "../../03_molecules/CPSATResult/CPSATResultPaginationControls ";
import CPSATResultTabRenderer from "../../03_molecules/CPSATResult/CPSATResultTabRenderer";
import useCPSATSlider from "@/hooks/useCPSATSlider";
import CPSATResulTabHeader from "../../03_molecules/CPSATResult/CPSATResulTabHeader";

type Props = {
  CPSATResult: CPSATSolutionType[];
  totalSolutionCount: number;
};

export default function CPSATResultsPanel({
  CPSATResult,
  totalSolutionCount,
}: Props) {
  const [tabMode, setTabMode] = useState<"timetableMode" | "summaryMode">(
    "timetableMode",
  );

  const { currentIndex, onPrev, onNext } = useCPSATSlider(totalSolutionCount);

  return (
    <div
      className="relative max-h-[95dvh] w-[75dvw] overflow-y-hidden"
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

      <CPSATResulTabHeader
        currentIndex={currentIndex}
        totalSolutionCount={totalSolutionCount}
      />

      <CPSATResultTabRenderer
        tabMode={tabMode}
        setTabMode={setTabMode}
        CPSATResult={CPSATResult}
        currentIndex={currentIndex}
      />
    </div>
  );
}
