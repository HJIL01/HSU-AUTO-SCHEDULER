import React from "react";
import TimeTableGrid from "../../../03_molecules/Timetable/TimeTableGrid";
import { getCourseBlockHeight } from "@/utils/getCourseBlockHeight";
import { getTopByStartTime } from "@/utils/getTopByStartTime";
import { COURSE_BLOCK_BG_COLORS } from "@/constants/CourseBlockBgColors";
import {
  CourseRenderInfoType,
  SelectedCoursesRenderMapType,
} from "@/types/courseRenderInfo.type";
import TimetableHead from "../../../03_molecules/Timetable/TimetableHead";
import { motion } from "framer-motion";

type Props = {
  selectedCoursesByDayList: SelectedCoursesRenderMapType[];
  currentIndex: number;
};

export default function CPSATResultTimetableTab({
  selectedCoursesByDayList,
  currentIndex,
}: Props) {
  return (
    <>
      <TimetableHead isCPSATResult />
      <div className="flex overflow-x-hidden">
        <motion.div
          className="flex w-full"
          initial={{
            translateX: `-${currentIndex * 100}%`,
          }}
          animate={{
            translateX: `-${currentIndex * 100}%`,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {selectedCoursesByDayList.map((selectedCoursesByDay, i) => {
            return (
              <div key={i} className="h-fit w-full shrink-0">
                <TimeTableGrid
                  selectedCoursesByDay={selectedCoursesByDay}
                  isCPSATResult={true}
                />
              </div>
            );
          })}
        </motion.div>
      </div>
    </>
  );
}
