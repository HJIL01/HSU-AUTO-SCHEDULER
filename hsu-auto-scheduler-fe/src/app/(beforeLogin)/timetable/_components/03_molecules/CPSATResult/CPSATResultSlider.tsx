"use client";

import { COURSE_BLOCK_BG_COLORS } from "@/constants/CourseBlockBgColors";
import {
  CourseRenderInfoType,
  SelectedCoursesRenderMapType,
} from "@/types/courseRenderInfo.type";
import { CPSATSolutionType } from "@/types/CPSATSolution.type";
import { getCourseBlockHeight } from "@/utils/getCourseBlockHeight";
import { getTopByStartTime } from "@/utils/getTopByStartTime";
import TimeTableGrid from "../Timetable/TimeTableGrid";
import { useState } from "react";
import CPSATResultTabChanger from "./CPSATResultTabChanger";
import { motion } from "framer-motion";
import ChevronRight from "@/assets/icons/chevron-right";
import TimetableHead from "../../04_atoms/Timetable/TimetableHead";
import useGetCPSATResults from "@/hooks/queries/useGetCPSATResults";
import { CPSAT_RESULT_PER_PAGE } from "@/constants/CPSATResultPerPage";

type Props = {
  CPSATResult: CPSATSolutionType[];
  totalSolutionCount: number;
};

export default function CPSATResultSlider({
  CPSATResult,
  totalSolutionCount,
}: Props) {
  const [tabMode, setTabMode] = useState<
    "timetableMode" | "onlineLectureMode" | "infoSummaryMode"
  >("timetableMode");
  const { fetchNextPage } = useGetCPSATResults();

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handlePrevIndex = () => {
    if (currentIndex === 0) {
      return;
    }

    setCurrentIndex((prev) => prev - 1);
  };

  const handleNextIndex = () => {
    if (currentIndex === totalSolutionCount - 1) {
      return;
    }

    if (currentIndex === CPSAT_RESULT_PER_PAGE - 2) {
      fetchNextPage();
    }

    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div
      className="relative"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {/* 왼쪽 chevron */}
      {currentIndex !== 0 && (
        <div
          className="fixed top-1/2 left-[5dvw] z-[999999999] flex aspect-square w-25 -translate-y-1/2 rotate-y-180 cursor-pointer items-center justify-center rounded-full border-2 border-[#8b8a8a] bg-transparent"
          onClick={handlePrevIndex}
        >
          <ChevronRight fill="#a8a8a8" width={35} height={35} />
        </div>
      )}
      {/* 오른쪽 chevron */}
      {currentIndex !== totalSolutionCount - 1 && (
        <div
          className="fixed top-1/2 right-[5dvw] z-[999999999] flex aspect-square w-25 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-[#8b8a8a] bg-transparent"
          onClick={handleNextIndex}
        >
          <ChevronRight fill="#a8a8a8" width={35} height={35} />
        </div>
      )}

      <div className="bg-course-finder-main-bg text-md absolute top-0 left-0 translate-y-[-98%] rounded-t-lg px-5 py-3 select-none">
        추천 시간표 {currentIndex + 1} / {totalSolutionCount}
      </div>

      <div className="flex h-fit w-[75dvw] flex-col">
        <TimetableHead isCPSATResult />
        <div className="flex overflow-x-hidden">
          <motion.div
            className="flex w-full"
            animate={{
              translateX: `-${currentIndex * 100}%`,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {CPSATResult.map((result) => {
              const selectedCoursesByDay: SelectedCoursesRenderMapType =
                new Map();
              const courses = result.selected_courses;

              courses.forEach((course, index) => {
                const baseInfo: CourseRenderInfoType = {
                  courseId: course.course_id,
                  courseName: course.course_name,
                  courseClassSection: course.class_section,
                  professors: course.professor_names,
                  colorIndex: 0,
                };

                if (course.offline_schedules.length === 0) {
                  const newNonTimes =
                    selectedCoursesByDay.get("nontimes") ?? [];
                  newNonTimes.push(baseInfo);
                  selectedCoursesByDay.set("nontimes", newNonTimes);
                } else {
                  course.offline_schedules.forEach((offlineSchedule) => {
                    const day = offlineSchedule.day;

                    const newCoursesInCurDay =
                      selectedCoursesByDay.get(day) ?? [];

                    newCoursesInCurDay.push({
                      ...baseInfo,
                      colorIndex:
                        (index % (COURSE_BLOCK_BG_COLORS.length - 1)) + 1,
                      offlineSchedule,
                      top: getTopByStartTime(course, day, true),
                      height: getCourseBlockHeight(course, day, true),
                    });

                    selectedCoursesByDay.set(day, newCoursesInCurDay);
                  });
                }
              });

              return (
                <div
                  key={result.solution_index}
                  className="h-fit w-full shrink-0"
                >
                  <TimeTableGrid
                    selectedCoursesByDay={selectedCoursesByDay}
                    isCPSATResult={true}
                  />
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
      <CPSATResultTabChanger tabMode={tabMode} setTabMode={setTabMode} />
    </div>
  );
}
