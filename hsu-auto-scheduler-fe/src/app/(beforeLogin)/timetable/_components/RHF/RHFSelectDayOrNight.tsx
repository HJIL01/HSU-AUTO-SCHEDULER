"use client";

import CustomSelectBox from "@/components/ui/CustomSelectBox";
import { DayOrNightEnum, DayOrNightKorMap } from "@/enums/dayOrNight.enum";
import { SchemaType } from "@/types/schema";
import { SelectOptionType } from "@/types/selectOption.type";
import { Controller, useFormContext } from "react-hook-form";

export default function RHFSelectDayOrNight() {
  const { control } = useFormContext<SchemaType>();
  const selectOptions: SelectOptionType[] = [
    DayOrNightEnum.DAY,
    DayOrNightEnum.NIGHT,
  ]
    .slice(0, 2)
    .map((e) => ({
      value: e,
      label: DayOrNightKorMap[e],
    }));
  return (
    <Controller
      name="dayOrNight"
      control={control}
      render={({ field }) => (
        <CustomSelectBox
          {...field}
          items={selectOptions}
          placeholder="주/야"
          className="!bg-course-fileter-bg border-course-list-border border"
        />
      )}
    />
  );
}
