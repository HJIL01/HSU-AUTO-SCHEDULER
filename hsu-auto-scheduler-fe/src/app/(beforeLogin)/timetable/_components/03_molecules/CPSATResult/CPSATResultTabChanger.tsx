"use client";

import clsx from "clsx";
import { Dispatch, SetStateAction } from "react";

type Props = {
  tabMode: "timetableMode" | "onlineLectureMode" | "infoSummaryMode";
  setTabMode: Dispatch<
    SetStateAction<"timetableMode" | "onlineLectureMode" | "infoSummaryMode">
  >;
};

export default function CPSATResultTabChanger({ tabMode, setTabMode }: Props) {
  const handleTabMode = (
    tabMode: "timetableMode" | "onlineLectureMode" | "infoSummaryMode",
  ) => {
    setTabMode(tabMode);
  };

  return (
    <div className="absolute top-0 right-0 flex translate-y-[-98%] bg-transparent text-xs">
      <button
        className={clsx(
          "rounded-t-lg p-5 transition-colors duration-200",
          tabMode === "timetableMode"
            ? "bg-course-finder-main-bg"
            : "bg-[#807f7e] text-zinc-800",
        )}
        onClick={(e) => handleTabMode("timetableMode")}
      >
        시간표 보기
      </button>
      <button
        className={clsx(
          "border-course-finder-border rounded-t-lg border-x p-5 transition-colors duration-200",
          tabMode === "onlineLectureMode"
            ? "bg-course-finder-main-bg"
            : "bg-[#807f7e] text-zinc-800",
        )}
        onClick={(e) => handleTabMode("onlineLectureMode")}
      >
        온라인 강의 보기
      </button>
      <button
        className={clsx(
          "rounded-t-lg p-5 transition-colors duration-200",
          tabMode === "infoSummaryMode"
            ? "bg-course-finder-main-bg"
            : "bg-[#807f7e] text-zinc-800",
        )}
        onClick={(e) => handleTabMode("infoSummaryMode")}
      >
        시간표 요약
      </button>
    </div>
  );
}
