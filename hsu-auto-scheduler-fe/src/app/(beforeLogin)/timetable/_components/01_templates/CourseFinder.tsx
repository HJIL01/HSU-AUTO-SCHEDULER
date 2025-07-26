"use client";

import DropDownArrow from "@/assets/icons/DrowDownArrow";
import CourseFilters from "../03_molecules/CourseFilters";
import CourseList from "../03_molecules/CourseList";
import { useShallow } from "zustand/shallow";
import { motion } from "framer-motion";
import { COURSE_FINDER_HEIGHT } from "@/constants/CourseFinderHeight";
import { useTimetableStore } from "@/store/store";

export default function CourseFinder() {
  const { isOpen, setClose } = useTimetableStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      setClose: state.setClose,
    })),
  );

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
      className="border-t-border border-t-course-list-border bg-course-list-main-bg fixed bottom-0 z-(--z-index-course-) w-full space-y-8 border-t px-5 py-7"
    >
      <button
        onClick={setClose}
        className="border-course-list-border bg-course-list-main-bg absolute top-0 right-0 translate-y-[-98%] rounded-t-lg border border-b-0 p-5"
      >
        <DropDownArrow />
      </button>
      <CourseFilters />
      <CourseList />
    </motion.div>
  );
}
