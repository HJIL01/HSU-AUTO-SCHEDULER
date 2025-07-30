"use client";

import clsx from "clsx";
import { Dispatch, SetStateAction } from "react";

type Props = {
  editMode: "course" | "schedule";
  setEditMode: Dispatch<SetStateAction<"course" | "schedule">>;
};

export default function CourseFinderTabChanger({
  editMode,
  setEditMode,
}: Props) {
  return (
    <div className="absolute top-0 left-0 flex translate-y-[-98%] bg-transparent text-xs">
      <button
        className={clsx(
          "border-course-finder-border boder-b-0 rounded-t-lg border border-r-0 border-b-0 p-5 transition-colors duration-200",
          editMode === "course"
            ? "bg-course-finder-main-bg"
            : "bg-[#807f7e] text-zinc-800",
        )}
        onClick={() => setEditMode("course")}
      >
        시간표 생성
      </button>
      <button
        className={clsx(
          "border-course-finder-border rounded-t-lg border border-b-0 p-5 transition-colors duration-200",
          editMode === "schedule"
            ? "bg-course-finder-main-bg"
            : "bg-[#807f7e] text-zinc-800",
        )}
        onClick={() => setEditMode("schedule")}
      >
        개인 스케줄 추가
      </button>
    </div>
  );
}
