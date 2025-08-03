"use client";

import { useFormContext } from "react-hook-form";
import FetchCPSATResult from "../../04_atoms/CourseFinder/FetchCPSATResult";
import {
  createCPSATSchemaDefaultValues,
  CreateCPSATschemaType,
} from "@/types/schemas/CreateCPSAT.schema";
import useCurrentSemester from "@/hooks/useCurrentSemester";

type Props = {
  hasEnoughData: boolean;
};

export default function FilterActionBtns({ hasEnoughData }: Props) {
  const { reset } = useFormContext<CreateCPSATschemaType>();
  const currentSemester = useCurrentSemester();

  const onReset = () => {
    const shouldReset = confirm("필터를 초기화 하시겠습니까?");

    if (!shouldReset) {
      return;
    }

    const { semester: _, ...rest } = createCPSATSchemaDefaultValues;

    reset({
      semester: currentSemester,
      ...rest,
    });
  };

  return (
    <div className="flex gap-2">
      <button
        className="bg-hsu h-full rounded-lg px-3 text-xs whitespace-nowrap text-white"
        onClick={onReset}
      >
        필터 초기화
      </button>
      <FetchCPSATResult hasEnoughData={hasEnoughData} />
    </div>
  );
}
