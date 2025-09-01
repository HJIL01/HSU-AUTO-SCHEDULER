"use client";

import CloseIcon from "@/assets/icons/CloseIcon";
import { useCPSATResultStore } from "@/store/CPSATResult/CPSATResultStore";
import { CPSATSolutionType } from "@/types/CPSATSolution.type";
import clsx from "clsx";
import { useShallow } from "zustand/shallow";

type Props = {
  currentIndex: number;
  totalSolutionCount: number;
  CPSATResult: CPSATSolutionType[];
};

export default function CPSATTabHeader({
  currentIndex,
  totalSolutionCount,
  CPSATResult,
}: Props) {
  const { setCPSATResultModalClose } = useCPSATResultStore(
    useShallow((state) => ({
      setCPSATResultModalClose: state.setCPSATResultModalClose,
    })),
  );

  const handleSelectCPSATResult = () => {
    const shouldSelect = confirm(
      `해당 시간표가 현재 학기의 시간표에 적용됩니다. 계속 하시겠습니까?`,
    );

    if (!shouldSelect) {
      return;
    }

    
  };

  return (
    <div
      className={clsx(
        "bg-linear-[135deg,var(--color-hsu)_0%,var(--color-deep-hsu)_100%]",
        "rounded-t-3xl px-10 py-8 text-white",
        "flex items-center justify-between",
      )}
    >
      <div className="flex items-center gap-3">
        <h3 className={clsx("text-lg font-bold", "max-md:text-base")}>
          추천 시간표
        </h3>

        <span
          className={clsx(
            "inline-block h-fit rounded-xl bg-white/20 px-5 py-3",
            "text-sm font-semibold",
            "max-md:text-xs",
          )}
        >
          {currentIndex + 1} / {totalSolutionCount}
        </span>
      </div>

      <div className={clsx("flex gap-5")}>
        <button
          type="button"
          onClick={handleSelectCPSATResult}
          className={clsx(
            "h-16",
            "px-3",
            "rounded-lg",
            "bg-white text-black",
            "text-xs",
            "max-sm:text-xxs",
          )}
        >
          시간표 선택
        </button>
        <button
          className={clsx(
            "flex items-center justify-center",
            "aspect-square w-16 rounded-full bg-white/20",
            "transition-all duration-200",
            "hover:rotate-z-90 hover:bg-white/30",
          )}
          onClick={setCPSATResultModalClose}
        >
          <CloseIcon fill="white" width={12} />
        </button>
      </div>
    </div>
  );
}
