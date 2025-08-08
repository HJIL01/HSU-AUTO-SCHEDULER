import { useState } from "react";
import useGetCPSATResults from "./queries/useGetCPSATResults";
import { CPSAT_RESULT_PER_PAGE } from "@/constants/CPSATResultPerPage";

export default function useCPSATSlider(totalSolutionCount: number) {
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

  return {
    currentIndex,
    onPrev,
    onNext,
  };
}
