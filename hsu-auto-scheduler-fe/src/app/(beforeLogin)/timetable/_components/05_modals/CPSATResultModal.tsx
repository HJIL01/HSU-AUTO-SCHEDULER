"use client";

import { Dispatch, SetStateAction } from "react";
import Portal from "@/components/Portal";
import CloseIcon from "@/assets/icons/CloseIcon";
import FetchingLoader from "./FetchingLoader";
import useCPSATProcessedData from "@/hooks/useCPSATProcessedData";
import CPSATResultTabsContainer from "../02_organisms/CPSATResult/CPSATResultTabsContainer";

type Props = {
  isFetching: boolean;
  setCPSATResultModalIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function CPSATResultModal({
  isFetching,
  setCPSATResultModalIsOpen,
}: Props) {
  const { totalSolutionCount, CPSATResult } = useCPSATProcessedData();

  return (
    <Portal>
      {isFetching ? (
        <FetchingLoader />
      ) : (
        <div
          className="fixed top-0 left-0 z-(--z-index-CPSATResult-modal) flex h-dvh w-full items-center justify-center bg-black/70"
          onClick={() => setCPSATResultModalIsOpen(false)}
        >
          {/* 닫기 버튼 */}
          <div className="fixed top-20 left-[5dvw] z-[999999999] flex aspect-square w-25 cursor-pointer items-center justify-center rounded-full border-2 border-[#8b8a8a]">
            <CloseIcon fill="#8b8a8a" width={25} height={25} />
          </div>
          {CPSATResult.length > 0 ? (
            <CPSATResultTabsContainer
              CPSATResult={CPSATResult}
              totalSolutionCount={totalSolutionCount}
            />
          ) : (
            <div className="px-5">
              <p className="mb-3 text-center text-xl text-gray-300">
                추천 시간표를 찾을 수 없습니다
              </p>
              <p className="text-center text-sm text-gray-300">
                너무 복잡하거나 데이터셋에서 조합할 수 없는 조건은 추천 시간표를
                계산하는데 어려움을 줄 수 있습니다
              </p>
            </div>
          )}
        </div>
      )}
    </Portal>
  );
}
