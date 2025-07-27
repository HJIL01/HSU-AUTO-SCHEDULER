"use client";

import useGetCPSATResults from "@/hooks/queries/useGetCPSATResults";
import { CreateCPSATschemaType } from "@/types/schemas/CreateCPSAT.schema";
import { useFormContext } from "react-hook-form";

type Props = {
  hasEnoughData: boolean;
};

export default function FetchCPSATResult({ hasEnoughData }: Props) {
  const { handleSubmit, getValues } = useFormContext<CreateCPSATschemaType>();
  const { data, refetch } = useGetCPSATResults();
  const filters = getValues();

  const confirmInsufficientCredit = () => {
    return confirm(
      `${filters.max_credit}학점을 조합하기에는 충분한 강의가 있지 않습니다. 계속하시겠습니까?`,
    );
  };

  const onSubmit = () => {
    if (!hasEnoughData && !confirmInsufficientCredit()) {
      return;
    }

    refetch();
  };

  const CPSATResult = data?.pages.flatMap((e) => e.data);
  console.log(CPSATResult);

  return (
    <button
      className="bg-hsu rounded-lg px-3 text-xs whitespace-nowrap text-white"
      onClick={handleSubmit(onSubmit)}
    >
      시간표 자동 생성
    </button>
  );
}
