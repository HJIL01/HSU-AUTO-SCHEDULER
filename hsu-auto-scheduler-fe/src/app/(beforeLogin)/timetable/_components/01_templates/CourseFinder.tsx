"use client";

import DropDownArrow from "@/assets/icons/DrowDownArrow";
import { useShallow } from "zustand/shallow";
import { motion } from "framer-motion";
import { COURSE_FINDER_HEIGHT } from "@/constants/CourseFinderHeight";
import { useTimetableStore } from "@/store/timetable/timetableStore";
import { useState } from "react";
import CourseTab from "../02_organisms/CourseFinder/CourseTab";
import CourseFinderTabChanger from "../03_molecules/CourseFinder/CourseFinderTabChanger";

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
        top: isOpen ? `${100 - COURSE_FINDER_HEIGHT}dvh` : "100dvh",
        opacity: isOpen ? 1 : 0,
      }}
      initial={{ top: "100vh", opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="border-t-border border-t-course-finder-border bg-course-finder-main-bg fixed bottom-0 z-(--z-index-course-finder) w-full border-t px-5 py-7"
    >
      <CourseFinderTabChanger editMode={editMode} setEditMode={setEditMode} />
      <button
        onClick={setClose}
        className="border-course-finder-border bg-course-finder-main-bg absolute top-0 right-0 translate-y-[-98%] rounded-t-lg border border-b-0 p-5"
      >
        <DropDownArrow />
      </button>
      {editMode === "course" ? (
        <CourseTab />
      ) : (
        <div className="h-full bg-red-500">ad</div>
      )}
    </motion.div>
  );
}
