"use client";

import CustomSelectBox from "@/components/ui/CustomSelectBox";
import { SchemaType } from "@/types/schema";
import { SemesterType } from "@/types/semester.type";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  semesters: SemesterType[];
};

export default function RHFSelectSemester({ semesters }: Props) {
  const { control } = useFormContext<SchemaType>();

  const selectBoxOptions = semesters.map((semester) => ({
    value: `${semester.year}-${semester.term}`,
    label: `${semester.year}년 ${semester.term}학기`,
  }));

  const handleChangeSemester = (semester: string) => {};

  return (
    <Controller
      name="semester_id"
      control={control}
      defaultValue={`${semesters[0].year}-${semesters[0].term}`}
      render={({ field }) => (
        <CustomSelectBox
          {...field}
          items={selectBoxOptions}
          onChange={(e) => {
            const value = e.target.value;
            field.onChange(value);
            handleChangeSemester(value);
          }}
        />
      )}
    />
  );
}
