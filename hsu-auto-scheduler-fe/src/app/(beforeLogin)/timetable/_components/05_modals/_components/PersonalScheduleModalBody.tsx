import { CustomInput } from "@/components/ui/CustomInput";
import CustomSelectBox from "@/components/ui/CustomSelectBox";
import clsx from "clsx";
import React, { useState } from "react";
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
      <form className="flex flex-col gap-10">
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
          />
        </div>

        <div className="bg-light-hsu border-border-hsu rounded-lg border-2 p-7">
          <div className="mb-8 flex items-center justify-between">
            <span className="text-hsu text-sm font-semibold">일정 목록</span>
            <button
              type="button"
              className={clsx(
                "rounded-lg px-5 py-4 text-xs font-semibold text-white transition-all duration-200",
                "hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(40,167,69,0.3)]",
              )}
              style={{
                background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
              }}
            >
              + 일정 추가
            </button>
          </div>

          <div className="relative rounded-xl border border-[#e9ecef] bg-white p-7">
            <PersonalScheduleItem />
          </div>
        </div>
      </form>
    </div>
  );
}
