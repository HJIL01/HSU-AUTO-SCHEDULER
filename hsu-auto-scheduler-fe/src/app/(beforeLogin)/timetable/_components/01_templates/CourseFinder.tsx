"use client";

import DropDownArrow from "@/assets/icons/DrowDownArrow";
import { useShallow } from "zustand/shallow";
import { motion } from "framer-motion";
import { COURSE_FINDER_HEIGHT } from "@/constants/CourseFinderHeight";
import { useTimetableStore } from "@/store/timetable/timetableStore";
import { useState } from "react";
import clsx from "clsx";
import CourseTab from "../02_organisms/CourseTab";

export default function CourseFinder() {
  const { isOpen, setClose } = useTimetableStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      setClose: state.setClose,
    })),
  );

  const [editMode, setEditMode] = useState<"course" | "schedule">("course");

  return (
    <motion.div
      style={{
        height: `${COURSE_FINDER_HEIGHT}dvh`,
      }}
      animate={{
        top: isOpen ? `${95 - COURSE_FINDER_HEIGHT}dvh` : "110dvh",
        opacity: isOpen ? 1 : 0,
      }}
      initial={{ top: "110vh", opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="border-t-border border-t-course-list-border bg-course-list-main-bg fixed bottom-0 z-(--z-index-course-finder) w-full border-t px-5 py-7"
    >
      <div className="bg-course-list-main-bg absolute top-0 left-0 flex translate-y-[-98%] text-xs">
        <button
          className={clsx(
            "border-course-list-border boder-b-0 rounded-t-lg border border-r-0 border-b-0 p-5 transition-colors duration-200",
            editMode === "schedule" && "bg-[#807f7e] text-zinc-800",
          )}
          onClick={() => setEditMode("course")}
        >
          시간표 생성
        </button>
        <button
          className={clsx(
            "border-course-list-border rounded-t-lg border border-b-0 p-5 transition-colors duration-200",
            editMode === "course" && "bg-[#807f7e] text-zinc-800",
          )}
          onClick={() => setEditMode("schedule")}
        >
          개인 스케줄 추가
        </button>
      </div>
      <button
        onClick={setClose}
        className="border-course-list-border bg-course-list-main-bg absolute top-0 right-0 translate-y-[-98%] rounded-t-lg border border-b-0 p-5"
      >
        <DropDownArrow />
      </button>
      {editMode === "course" ? <CourseTab /> : <div>ad</div>}
    </motion.div>
  );
}
