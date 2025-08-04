import { CustomInput } from "@/components/ui/CustomInput";
import clsx from "clsx";
import { useState } from "react";
import PersonalScheduleItem from "./PersonalScheduleItem";

export default function PersonalScheduleModalBody() {
  const [isFocus, setIsFocus] = useState<boolean>(false);

  const onFocus = () => {
    setIsFocus(true);
  };

  const onBlur = () => {
    setIsFocus(false);
  };

  return (
    <div className="p-10">
      <div className="flex flex-col gap-10">
        <div>
          <label
            htmlFor="scheduleName"
            className="text-hsu mb-5 block text-sm font-semibold"
          >
            스케줄 이름
          </label>
          <CustomInput
            name="scheduleName"
            id="scheduleName"
            className={clsx(
              "bg-light-hsu border-border-hsu w-full border-2 transition-all duration-200",
              isFocus &&
                "border-deep-hsu bg-white shadow-[0_0_0_3px_rgba(68,114,196,0.1)]",
            )}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder="예) 알바"
          />
        </div>

        <div className="bg-light-hsu border-border-hsu max-h-[60dvh] overflow-y-auto rounded-lg border-2 p-7">
          <div className="mb-8 flex items-center justify-between">
            <span className="text-hsu text-sm font-semibold">일정 목록</span>
            <button
              type="button"
              className={clsx(
                "rounded-lg px-5 py-4 text-xs font-semibold text-white transition-all duration-200",
                "hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(40,167,69,0.3)]",
                "disabled:cursor-not-allowed",
                "bg-[linear-gradient(135deg,_#28a745_0%,_#20c997_100%)]",
                "disabled:pointer-events-none disabled:opacity-0",
              )}
            >
              + 일정 추가
            </button>
          </div>

          <div className="flex flex-col gap-5">
            <PersonalScheduleItem />
            <PersonalScheduleItem />
          </div>
        </div>
      </div>
    </div>
  );
}
