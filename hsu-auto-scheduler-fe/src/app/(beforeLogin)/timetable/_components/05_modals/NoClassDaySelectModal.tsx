"use client";

import { WeekdayEnum, WeekdayKorMap, WeekdayOrder } from "@/enums/weekday.enum";
import { useFormContext } from "react-hook-form";
import { FormEvent, useState } from "react";
import {
  createCPSATSchemaDefaultValues,
  CreateCPSATschemaType,
} from "@/types/schemas/CreateCPSAT.schema";
import Portal from "@/components/Portal";
import CloseIcon from "@/assets/icons/CloseIcon";

type Props = {
  closeNoClassDaysModal: () => void;
};

export default function NoClassDaySelectModal({
  closeNoClassDaysModal,
}: Props) {
  const { getValues, setValue } = useFormContext<CreateCPSATschemaType>();
  const currentNoClassDays = getValues("no_class_days");

  const [selectedNoClassDays, setSelectNoClassDays] = useState<
    Set<WeekdayEnum>
  >(new Set(currentNoClassDays));

  const handleSelectNoClassDays = (day: WeekdayEnum) => {
    const newSet = new Set(selectedNoClassDays);

    newSet.has(day) ? newSet.delete(day) : newSet.add(day);

    setSelectNoClassDays(newSet);
  };

  const handleApplyNoClassDays = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const selectedNoClassDaysArray: WeekdayEnum[] = Array.from(
      selectedNoClassDays,
    ).sort((a, b) => WeekdayOrder[a] - WeekdayOrder[b]);

    setValue("no_class_days", selectedNoClassDaysArray);

    closeNoClassDaysModal();
  };

  const handleResetNoClassDays = () => {
    const noClassDaysDefaultValue =
      createCPSATSchemaDefaultValues.no_class_days;

    setSelectNoClassDays(new Set(noClassDaysDefaultValue));
  };

  return (
    <Portal>
      <div
        className="fixed top-0 left-0 z-(--z-index-no-class-days-modal) flex h-dvh w-full items-center justify-center bg-black/30"
        onClick={closeNoClassDaysModal}
      >
        <form
          className="z-[9999] w-200 space-y-5 bg-white p-12"
          onSubmit={handleApplyNoClassDays}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex items-center justify-between text-lg">
            <h3>공강 요일 선택</h3>
            <div
              className="relative aspect-square w-10 cursor-pointer"
              onClick={closeNoClassDaysModal}
            >
              <CloseIcon />
            </div>
          </div>

          <div className="text-base">
            {Object.values(WeekdayEnum).map((day) => (
              <label
                key={day}
                className="flex cursor-pointer items-center gap-2 rounded-sm p-3 hover:bg-black/5"
              >
                <h4>{WeekdayKorMap[day]}</h4>
                <input
                  type="checkbox"
                  value={day}
                  onChange={() => handleSelectNoClassDays(day)}
                  checked={selectedNoClassDays.has(day)}
                />
              </label>
            ))}
          </div>

          <div className="flex justify-between text-xs text-zinc-800">
            <button
              type="button"
              className="bg-course-fileter-bg border-course-list-border rounded-[18px] border px-5 py-3"
              onClick={handleResetNoClassDays}
            >
              초기화
            </button>
            <button className="bg-hsu rounded-[18px] border px-5 py-3 text-white">
              적용
            </button>
          </div>
        </form>
      </div>
    </Portal>
  );
}
