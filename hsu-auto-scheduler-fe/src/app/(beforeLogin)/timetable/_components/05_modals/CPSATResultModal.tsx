"use client";

import Portal from "@/components/Portal";
import FetchingLoader from "./FetchingLoader";
import CPSATResultsPanel from "../02_organisms/CPSATResult/CPSATResultsPanel";
import useCPSATDataProcess from "@/hooks/CPSAT/useCPSATDataProcess";

type Props = {
  isFetching: boolean;
};

export default function CPSATResultModal({ isFetching }: Props) {
  const { totalSolutionCount, CPSATResult } = useCPSATDataProcess();

  return (
    <Portal>
      {isFetching ? (
        <FetchingLoader />
      ) : (
        <div className="fixed top-0 left-0 z-(--z-index-CPSATResult-modal) flex h-dvh w-full justify-center overflow-y-hidden bg-black/70 py-10">
          {CPSATResult.length > 0 ? (
            <CPSATResultsPanel
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
