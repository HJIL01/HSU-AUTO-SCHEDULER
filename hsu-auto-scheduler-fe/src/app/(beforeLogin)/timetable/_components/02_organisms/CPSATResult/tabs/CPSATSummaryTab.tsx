"use client";

import { motion } from "framer-motion";
import CPSATSummarySlideItem from "../../../03_molecules/CPSATResult/slide/CPSATSummarySlideItem";
import { CPSATSolutionType } from "@/types/CPSATSolution.type";

type Props = {
  CPSATResult: CPSATSolutionType[];
  currentIndex: number;
};

export default function CPSATSummaryTab({ CPSATResult, currentIndex }: Props) {
  return (
    <div className="h-full overflow-x-hidden">
      <motion.div
        className="flex h-full w-full"
        initial={{
          translateX: `-${100 * currentIndex}%`,
        }}
        animate={{
          translateX: `-${currentIndex * 100}%`,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {CPSATResult.map((result) => (
          <CPSATSummarySlideItem
            key={result.solution_index}
            totalCredit={result.total_credit}
            offlineCourseCount={result.total_offline_course_count}
            onlineCourseCount={result.total_online_course_count}
            noClassDays={result.no_class_days}
            totalCourseGap={result.total_course_gap}
            selectedCourses={result.selected_courses}
          />
        ))}
      </motion.div>
    </div>
  );
}
