"use client";

import useGetConstraintsResult from "@/hooks/queries/useGetConstraintsResult";
import { CPSAT_SolutionType } from "@/types/CP-SAT-Solution.type";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { useShallow } from "zustand/shallow";
import { motion } from "framer-motion";
import { COURSE_FINDER_HEIGHT } from "@/constants/CourseFinderHeight";
import TimeTableGrid from "../03_molecules/TimeTableGrid";
import OnlineCourseList from "../03_molecules/OnlineCourseList";
import {
  CourseRenderInfoType,
  HoverCourseRenderMapType,
  SelectedCoursesRenderMapType,
} from "@/types/courseRenderInfo.type";
import { getOfflineScheduleInCurDay } from "@/utils/getOfflineScheduleInCurDay";
import { getTopByStartTime } from "@/utils/getTopByStartTime";
import { getCourseBlockHeight } from "@/utils/getCourseBlockHeight";
import { COURSE_BLOCK_BG_COLORS } from "@/constants/CourseBlockBgColors";
import { useTimetableStore } from "@/store/store";

export default function TimeTableBody() {
  const [mockData, setMockData] = useState<CPSAT_SolutionType>();
  const { refetch } = useGetConstraintsResult();

  const getCPSATResult = async () => {
    const { data } = await refetch();
    setMockData(data.data.solutions.slice(0, 1)[0]);
  };

  const { isOpen, hoveredCourse, selectedCourses, timeSelections } =
    useTimetableStore(
      useShallow((state) => ({
        isOpen: state.isOpen,
        hoveredCourse: state.hoveredCourse,
        selectedCourses: state.selectedCourses,
        timeSelections: state.timeSelectionsByDay,
      })),
    );

  const hoveredCourseByDay: HoverCourseRenderMapType = useMemo(() => {
    if (!hoveredCourse) return new Map();

    const baseInfo: CourseRenderInfoType = {
      courseId: hoveredCourse.course_id,
      courseName: hoveredCourse.course_name,
      courseClassSection: hoveredCourse.class_section,
      professors: hoveredCourse.professor_names,
      colorIndex: 0,
    };

    if (hoveredCourse.offline_schedules.length > 0) {
      return hoveredCourse.offline_schedules.reduce((acc, cur) => {
        acc.set(cur.day, {
          ...baseInfo,
          offlineSchedule: getOfflineScheduleInCurDay(hoveredCourse, cur.day),
          top: getTopByStartTime(hoveredCourse, cur.day),
          height: getCourseBlockHeight(hoveredCourse, cur.day),
        });
        return acc;
      }, new Map());
    }

    return new Map([["nontime", baseInfo]]);
  }, [hoveredCourse]);

  const selectedCoursesByDay: SelectedCoursesRenderMapType = useMemo(() => {
    const dayMap: SelectedCoursesRenderMapType = new Map();

    selectedCourses.forEach((selectedCourse, index) => {
      const baseInfo: CourseRenderInfoType = {
        courseId: selectedCourse.course_id,
        courseName: selectedCourse.course_name,
        courseClassSection: selectedCourse.class_section,
        professors: selectedCourse.professor_names,
        colorIndex: 0,
      };

      if (selectedCourse.offline_schedules.length === 0) {
        const newNontimes = dayMap.get("nontimes") ?? [];
        newNontimes.push(baseInfo);
        dayMap.set("nontimes", newNontimes);
      } else {
        selectedCourse.offline_schedules.forEach((offlineSchedule) => {
          const curDay = offlineSchedule.day;

          const newCoursesInCurDay = dayMap.get(curDay) ?? [];
          newCoursesInCurDay.push({
            ...baseInfo,
            offlineSchedule,
            top: getTopByStartTime(selectedCourse, curDay),
            height: getCourseBlockHeight(selectedCourse, curDay),
            colorIndex: (index % (COURSE_BLOCK_BG_COLORS.length - 1)) + 1,
          });
          dayMap.set(curDay, newCoursesInCurDay);
        });
      }
    });

    return dayMap;
  }, [selectedCourses]);

  return (
    <motion.div
      animate={{
        height: isOpen
          ? window.innerHeight * (COURSE_FINDER_HEIGHT / 100) + 52
          : "100%",
      }}
      transition={{
        duration: 1,
        ease: "easeInOut",
      }}
      className={clsx("relative w-full")}
    >
      <TimeTableGrid
        selectedCoursesByDay={selectedCoursesByDay}
        hoveredCourseByDay={hoveredCourseByDay}
      />
      <OnlineCourseList />

      <button
        className="fixed top-0 right-0 z-50 h-50 w-50 bg-red-500 text-2xl"
        onClick={getCPSATResult}
      >
        가져오기sadsad
      </button>
    </motion.div>
  );
}
