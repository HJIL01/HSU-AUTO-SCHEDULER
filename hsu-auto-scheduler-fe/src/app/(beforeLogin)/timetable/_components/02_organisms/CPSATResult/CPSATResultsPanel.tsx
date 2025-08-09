"use client";

import { CPSATSolutionType } from "@/types/CPSATSolution.type";
import { useState } from "react";
import CPSATResultTabRenderer from "../../03_molecules/CPSATResult/CPSATTabRenderer";
import useCPSATSlider from "@/hooks/useCPSATSlider";
import CPSATResultTabHeader from "../../03_molecules/CPSATResult/CPSATTabHeader";
import CPSATPaginationControls from "../../03_molecules/CPSATResult/CPSATPaginationControls ";
import CPSATTabHeader from "../../03_molecules/CPSATResult/CPSATTabHeader";
import CPSATTabRenderer from "../../03_molecules/CPSATResult/CPSATTabRenderer";
import clsx from "clsx";

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
      className={clsx(
        "relative max-h-[95dvh] w-[75dvw] overflow-y-hidden",
        "max-md:w-[85dvw]",
      )}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <CPSATPaginationControls
        currentIndex={currentIndex}
        totalSolutionCount={totalSolutionCount}
        onPrev={onPrev}
        onNext={onNext}
      />

      <CPSATTabHeader
        currentIndex={currentIndex}
        totalSolutionCount={totalSolutionCount}
      />

      <CPSATTabRenderer
        tabMode={tabMode}
        setTabMode={setTabMode}
        CPSATResult={CPSATResult}
        currentIndex={currentIndex}
      />
    </div>
  );
}
