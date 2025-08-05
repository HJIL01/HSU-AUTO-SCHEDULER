"use client";

import CloseIcon from "@/assets/icons/CloseIcon";
import { CustomInput } from "@/components/ui/CustomInput";
import CustomSelectBox from "@/components/ui/CustomSelectBox";
import { DAYS } from "@/constants/days";
import { HOURS } from "@/constants/hours";
import { WeekdayKorMap } from "@/enums/weekday.enum";
import useTimeRangeFields from "@/hooks/useTimeRangeFields";
import { OfflineScheduleType } from "@/types/schemas/OfflineSchedule.schema";
import { PersonalScheduleType } from "@/types/schemas/PersonalSchedule.schema";
import { SelectOptionType } from "@/types/selectOption.type";
import clsx from "clsx";
import { Control, Controller } from "react-hook-form";

type Props = {
  index: number;
  control: Control<PersonalScheduleType>;
  onRemove: (index: number) => void;
  onChange: (
    index: number,
    fieldName: keyof OfflineScheduleType,
    value: OfflineScheduleType[keyof OfflineScheduleType],
  ) => void;
};

export default function PersonalScheduleItem({
  index,
  control,
  onRemove,
  onChange,
}: Props) {
  const dayItems: SelectOptionType[] = DAYS.map((day) => ({
    label: WeekdayKorMap[day],
    value: day,
  }));

  const hourItems: SelectOptionType[] = HOURS.map((hour) => ({
    label:
      hour < 12
        ? `오전 ${hour === 0 ? 12 : hour}시`
        : `오후 ${hour === 12 ? 12 : hour % 12}시`,
    value: hour * 60,
  }));

  const minItems: SelectOptionType[] = Array.from(
    { length: 60 / 5 },
    (_, i) => i * 5,
  ).map((min) => ({
    label: `${String(min).padStart(2, "0")}분`,
    value: min,
  }));

  const {
    startTime,
    endTime,
    handleStartHour,
    handleStartMin,
    handleEndHour,
    handleEndMin,
  } = useTimeRangeFields({ index, onChange });

  return (
    <div className="relative rounded-xl border border-[#e9ecef] bg-white p-7">
      <div
        className={clsx(
          "flex flex-wrap gap-3 max-sm:flex-col",
          "[&_label]:text-hsu [&_label]:mb-1 [&_label]:ml-1 [&_label]:block [&_label]:font-semibold",
          "[&_select]:border-border-hsu [&_select]:focus:border-deep-hsu [&_select]:border-2 [&_select]:transition-all [&_select]:duration-200 [&_select]:focus:shadow-[0_0_0_3px_rgba(68,114,196,0.1)]",
          "[&_input]:border-border-hsu [&_input]:focus:border-deep-hsu [&_input]:border-2 [&_input]:transition-all [&_input]:duration-200 [&_input]:focus:shadow-[0_0_0_3px_rgba(68,114,196,0.1)]",
        )}
      >
        <button
          type="button"
          className={clsx(
            "absolute top-0 right-0 flex aspect-square w-12 translate-x-[30%] translate-y-[-40%] items-center justify-center rounded-full",
            "bg-red-600/80 transition-all duration-200 hover:rotate-z-90 hover:bg-red-600",
          )}
          onClick={() => onRemove(index)}
        >
          <CloseIcon fill="white" className="aspect-square w-5" />
        </button>
        <div>
          <label htmlFor={`offline_schedules.${index}.day`}>요일</label>
          <Controller
            name={`offline_schedules.${index}.day`}
            control={control}
            render={({ field }) => (
              <CustomSelectBox
                items={dayItems}
                id={`offline_schedules.${index}.day`}
                {...field}
              />
            )}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor={`startHour${index}`}>시작 시간</label>
          <div className="flex gap-2">
            <CustomSelectBox
              items={hourItems}
              id={`startHour${index}`}
              name={`startHour${index}`}
              value={startTime.startHour}
              onChange={handleStartHour}
            />
            <CustomSelectBox
              items={minItems}
              id={`startMin${index}`}
              name={`startMin${index}`}
              value={startTime.startMin}
              onChange={handleStartMin}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor={`endHour${index}`}>종료 시간</label>
          <div className="flex gap-2">
            <CustomSelectBox
              items={hourItems}
              id={`endHour${index}`}
              name={`endHour${index}`}
              value={endTime.endHour}
              onChange={handleEndHour}
            />
            <CustomSelectBox
              items={minItems}
              id={`endMin${index}`}
              name={`endMin${index}`}
              value={endTime.endMin}
              onChange={handleEndMin}
            />
          </div>
        </div>

        <div className="flex max-w-[50%] flex-1 flex-col">
          <label htmlFor={`offline_schedules.${index}.place`}>장소</label>
          <Controller
            name={`offline_schedules.${index}.place`}
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                id={`offline_schedules.${index}.place`}
                placeholder="예) 상상관"
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
