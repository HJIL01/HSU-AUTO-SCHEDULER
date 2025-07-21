"use client";

import getMajors from "@/api/getMajors";
import CustomSelectBox from "@/components/ui/CustomSelectBox";
import { CreateCPSATschemaType } from "@/types/schemas/CreateCPSAT.schema";
import { SelectOptionType } from "@/types/selectOption.type";
import { SemesterType } from "@/types/semester.type";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  semesters: SemesterType[];
};

export default function RHFSelectSemester({ semesters }: Props) {
  // useEffect를 사용한 prefetch 때문에 해당 컴포넌트는  RHFCustomSelect를 사용하지 못함
  // 전용 컴포넌트로 남김
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useSearchParams();

  const { control, getValues } = useFormContext<CreateCPSATschemaType>();

  const currentSemester = getValues("semester");

  const selectBoxOptions: SelectOptionType[] = semesters.map((semester) => ({
    value: `${semester.year}-${semester.term}`,
    label: `${semester.year}년 ${semester.term}학기`,
  }));

  const handleChangeSemester = (semester: string) => {
    router.replace(`/timetable/${semester}?${params}`);
  };

  const handleSelectChange = (
    value: string,
    onChange: (...event: any[]) => void,
  ) => {
    onChange(value);
    handleChangeSemester(value);
  };

  useEffect(() => {
    const [year, term] = currentSemester.split("-");
    queryClient.prefetchQuery({
      queryKey: ["majors", currentSemester],
      queryFn: () => getMajors(year, term),
    });
  }, [currentSemester]);

  return (
    <Controller
      name="semester"
      control={control}
      render={({ field }) => (
        <CustomSelectBox
          {...field}
          items={selectBoxOptions}
          placeholder="학기"
          onChange={(e) => handleSelectChange(e.target.value, field.onChange)}
        />
      )}
    />
  );
}
