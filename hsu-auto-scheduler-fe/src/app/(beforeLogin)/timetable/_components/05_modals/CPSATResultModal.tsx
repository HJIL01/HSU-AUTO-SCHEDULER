"use client";

import { Dispatch, SetStateAction } from "react";
import { CPSATSolutionType } from "@/types/CPSATSolution.type";
import Portal from "@/components/Portal";
import CPSATResultSlider from "../03_molecules/CPSATResult/CPSATResultSlider";
import CloseIcon from "@/assets/icons/CloseIcon";

type Props = {
  isFetching: boolean;
  setCPSATResultModalIsOpen: Dispatch<SetStateAction<boolean>>;
  CPSATResult?: CPSATSolutionType[];
  totalSolutionCount: number;
};

export default function CPSATResultModal({
  isFetching,
  setCPSATResultModalIsOpen,
  CPSATResult,
  totalSolutionCount,
}: Props) {
  return (
    <Portal>
      {CPSATResult &&
        (CPSATResult.length > 0 ? (
          <div
            className="fixed top-0 left-0 z-(--z-index-CPSATResult-modal) flex h-dvh w-full items-center justify-center bg-black/70"
            onClick={() => setCPSATResultModalIsOpen(false)}
          >
            {/* 닫기 버튼 */}
            <div className="fixed top-20 left-[5dvw] z-[999999999] flex aspect-square w-25 cursor-pointer items-center justify-center rounded-full border-2 border-[#8b8a8a]">
              <CloseIcon fill="#a8a8a8" width={25} height={25} />
            </div>
            <CPSATResultSlider
              CPSATResult={CPSATResult}
              totalSolutionCount={totalSolutionCount}
            />
          </div>
        ) : (
          <div>해 없음!</div>
        ))}
    </Portal>
  );
}
