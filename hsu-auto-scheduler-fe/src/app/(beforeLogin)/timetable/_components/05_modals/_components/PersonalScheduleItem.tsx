import CustomSelectBox from "@/components/ui/CustomSelectBox";
import { HOURS } from "@/constants/hours";
import { SelectOptionType } from "@/types/selectOption.type";
import React from "react";

export default function PersonalScheduleItem() {
  const hourItems: SelectOptionType[] = HOURS.map((hour) => ({
    label: hour,
    value: hour,
  }));

  return (
    <div>
      <label htmlFor="">시작 시간</label>
      <CustomSelectBox items={hourItems} name="hour" />
    </div>
  );
}
