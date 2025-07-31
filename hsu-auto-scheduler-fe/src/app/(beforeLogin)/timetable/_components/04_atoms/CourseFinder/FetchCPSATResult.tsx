"use client";

import useGetCPSATResults from "@/hooks/queries/useGetCPSATResults";
import { CreateCPSATschemaType } from "@/types/schemas/CreateCPSAT.schema";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import CPSATResultModal from "../../05_modals/CPSATResultModal";

type Props = {
  hasEnoughData: boolean;
};

export default function FetchCPSATResult({ hasEnoughData }: Props) {
  const [CPSATResultModalIsOpen, setCPSATResultModalIsOpen] =
    useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { handleSubmit, getValues } = useFormContext<CreateCPSATschemaType>();
  const { refetch } = useGetCPSATResults();
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

  return (
    <>
      <button
        className="bg-hsu h-full rounded-lg px-3 text-xs whitespace-nowrap text-white"
        onClick={handleSubmit(onSubmit)}
      >
        시간표 자동 생성
      </button>
      {CPSATResultModalIsOpen && (
        <CPSATResultModal
          isFetching={isFetching}
          setCPSATResultModalIsOpen={setCPSATResultModalIsOpen}
        />
      )}
    </>
  );
}
