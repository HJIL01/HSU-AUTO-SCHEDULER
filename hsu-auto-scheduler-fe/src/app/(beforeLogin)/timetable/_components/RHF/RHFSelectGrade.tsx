"use client";

import CustomSelectBox from "@/components/ui/CustomSelectBox";
import { SchemaType } from "@/types/schema";
import { SelectOptionType } from "@/types/selectOption.type";
import { Controller, useFormContext } from "react-hook-form";

export default function RHFSelectGrade() {
  const { control } = useFormContext<SchemaType>();

  const selectOptions: SelectOptionType[] = Array.from({ length: 4 }).map(
    (_, i) => ({
      value: i + 1,
      label: i + 1,
    }),
  );

  return (
    <Controller
      name="grade"
      control={control}
      render={({ field }) => (
        <CustomSelectBox
          {...field}
          items={selectOptions}
          placeholder="학년"
          className="!bg-course-fileter-bg border-course-list-border border"
        />
      )}
    />
  );
}
