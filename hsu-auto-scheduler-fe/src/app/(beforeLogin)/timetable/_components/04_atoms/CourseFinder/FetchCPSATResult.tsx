"use client";

import useGetCPSATResults from "@/hooks/queries/useGetCPSATResults";
import { CreateCPSATschemaType } from "@/types/schemas/CreateCPSAT.schema";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import CPSATResultModal from "../../05_modals/CPSATResultModal";

type Props = {
  hasEnoughData: boolean;
};

export default function FetchCPSATResult({ hasEnoughData }: Props) {
  const [totalSolutionCount, setTotalSolutionCount] = useState<number>(0);
  const [CPSATResultModalIsOpen, setCPSATResultModalIsOpen] =
    useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { handleSubmit, getValues } = useFormContext<CreateCPSATschemaType>();
  const { data, refetch } = useGetCPSATResults();
  const filters = getValues();

  const confirmInsufficientCredit = () => {
    return confirm(
      `${filters.max_credit}학점을 조합하기에는 충분한 강의가 있지 않습니다. 계속하시겠습니까?`,
    );
  };

  const onSubmit = async () => {
    if (!hasEnoughData && !confirmInsufficientCredit()) return;

    setCPSATResultModalIsOpen(true);
    setIsFetching(true);
    const start = Date.now();

    await refetch();

    const elapsed = Date.now() - start;
    const minTime = 700;
    setTimeout(
      () => setIsFetching(false),
      Math.max(minTime, minTime - elapsed),
    );
  };

  useEffect(() => {
    if (data) {
      setTotalSolutionCount(data.pages[0].data.total_solution_count);
    }
  }, [data, setTotalSolutionCount]);

  const CPSATResult = data?.pages.flatMap((e) => {
    return e.data.solutions;
  });

  return (
    <>
      <button
        className="bg-hsu rounded-lg px-3 text-xs whitespace-nowrap text-white"
        onClick={handleSubmit(onSubmit)}
      >
        시간표 자동 생성
      </button>
      {CPSATResultModalIsOpen && (
        <CPSATResultModal
          isFetching={isFetching}
          setCPSATResultModalIsOpen={setCPSATResultModalIsOpen}
          CPSATResult={CPSATResult}
          totalSolutionCount={totalSolutionCount}
        />
      )}
    </>
  );
}
