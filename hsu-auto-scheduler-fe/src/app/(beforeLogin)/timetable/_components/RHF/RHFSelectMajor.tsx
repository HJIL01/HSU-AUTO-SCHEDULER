"use client";

import CustomSelectBox from "@/components/ui/CustomSelectBox";
import { useGetMajors } from "@/hooks/queries/useGetMajors";
import { SchemaType } from "@/types/schema";
import { SelectOptionType } from "@/types/selectOption.type";
import { Controller, useFormContext } from "react-hook-form";

export default function RHFSelectMajor() {
  const { control, watch } = useFormContext<SchemaType>();
  const currentSemester = watch("semester");

  const { data: getMajorsResponse, isPending } = useGetMajors(currentSemester);

  if (isPending) {
    console.log("준비중");
    // return;
  }

  const selectedOptions: SelectOptionType[] =
    getMajorsResponse?.data.map((major) => ({
      value: major.major_code,
      label: major.major_name,
    })) ?? [];

  //   const handleSelectBoxOnBlur = (selectBox: HTMLSelectElement) => {
  //     selectBox.size = 1;
  //   };

  //   const handleSelectBoxOnFocus = (selectBox: HTMLSelectElement) => {
  //     selectBox.size = 10;
  //   };

  //   const handleMajorChange = (
  //     selectBox: HTMLSelectElement,
  //     onChange: (...event: any[]) => void,
  //   ) => {
  //     onChange(selectBox.value);
  //     selectBox.blur();
  //   };

  return (
    <Controller
      name="major"
      control={control}
      render={({ field }) => (
        <CustomSelectBox
          {...field}
          items={selectedOptions}
          placeholder="학과를 선택하세요"
          className="!bg-course-fileter-bg border-course-list-border border"
          //   onFocus={(e) => handleSelectBoxOnFocus(e.target)}
          //   onBlur={(e) => handleSelectBoxOnBlur(e.target)}
          //   onChange={(e) => handleMajorChange(e.target, field.onChange)}
        />
      )}
    />
  );
}
