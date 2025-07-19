"use client";

import CourseFilters from "../Organisms/CourseFilters";
import DropDownArrow from "@/assets/icons/DrowDownArrow";

export default function CourseList() {
  return (
    <div className="border-t-border border-t-course-list-border bg-course-list-main-bg fixed bottom-0 z-[999] h-[65dvh] w-full border-t px-5 py-7">
      <CourseFilters />
      <button className="border-course-list-border bg-course-list-main-bg absolute top-0 right-0 -translate-y-full rounded-t-lg border border-b-0 p-5">
        <DropDownArrow />
      </button>
    </div>
  );
}
