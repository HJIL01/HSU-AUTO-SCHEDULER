"use client";

import { Dispatch, SetStateAction } from "react";
import TimeTableGrid from "../03_molecules/TimeTableGrid";
import { CPSATSolutionType } from "@/types/CPSATSolution.type";
import Portal from "@/components/Portal";
import { SelectedCoursesRenderMapType } from "@/types/courseRenderInfo.type";

type Props = {
  isFetching: boolean;
  setCPSATResultModalIsOpen: Dispatch<SetStateAction<boolean>>;
  CPSATResult?: CPSATSolutionType[];
};

export default function CPSATResultModal({
  isFetching,
  setCPSATResultModalIsOpen,
  CPSATResult,
}: Props) {
  return (
    <Portal>
      {CPSATResult &&
        (CPSATResult.length > 0 ? (
          <div
            className="fixed top-0 left-0 z-(--z-index-CPSATResult-modal) flex h-dvh w-full items-center justify-center bg-black/30"
            onClick={() => setCPSATResultModalIsOpen(false)}
          >
            <div className="bg-course-finder-main-bg aspect-square w-[80vw] border">
              {CPSATResult &&
                CPSATResult.map((result) => {
                  const CPSATSolutionSelectedCoursesMap =
                    result.selected_courses;

                  console.log(CPSATSolutionSelectedCoursesMap);
                  return (
                    <TimeTableGrid
                      key={result.solution_index}
                      className="absolute top-20 left-0 origin-top-left scale-50"
                    />
                  );
                })}
            </div>
          </div>
        ) : (
          <div>해 없음!</div>
        ))}
    </Portal>
  );
}
