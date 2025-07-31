"use client";

import { useEffect, useMemo } from "react";
import clsx from "clsx";
import { useShallow } from "zustand/shallow";
import { motion } from "framer-motion";
import { COURSE_FINDER_HEIGHT } from "@/constants/CourseFinderHeight";
import TimeTableGrid from "../../03_molecules/Timetable/TimeTableGrid";
import OnlineCourseList from "../../03_molecules/Timetable/OnlineCourseListForTimetable";
import {
  CourseRenderInfoType,
  HoverCourseRenderMapType,
  SelectedCoursesRenderMapType,
} from "@/types/courseRenderInfo.type";
import { getOfflineScheduleInCurDay } from "@/utils/getOfflineScheduleInCurDay";
import { getTopByStartTime } from "@/utils/getTopByStartTime";
import { getCourseBlockHeight } from "@/utils/getCourseBlockHeight";
import { COURSE_BLOCK_BG_COLORS } from "@/constants/CourseBlockBgColors";
import { useTimetableStore } from "@/store/timetable/timetableStore";
import useCurrentSemester from "@/hooks/useCurrentSemester";
import OnlineCourseListForTimetable from "../../03_molecules/Timetable/OnlineCourseListForTimetable";

export default function TimeTableBody() {
  const currentSemester = useCurrentSemester();
  const {
    isOpen,
    hoveredCourse,
    selectedCourses,
    ensureSemesterInitialized,
    // timetableSelections,
  } = useTimetableStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      hoveredCourse: state.hoveredCourse,
      selectedCourses: state.selectedCourses,
      ensureSemesterInitialized: state.ensureSemesterInitialized,
      // timetableSelections: state.timetableSelections,
    })),
  );
  const semesterSelectedCourses = selectedCourses[currentSemester];

  useEffect(() => {
    if (!semesterSelectedCourses) {
      ensureSemesterInitialized(currentSemester);
    }
  }, [semesterSelectedCourses, ensureSemesterInitialized, currentSemester]);

  const hoveredCourseByDay: HoverCourseRenderMapType | undefined =
    useMemo(() => {
      if (!hoveredCourse) return undefined;

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
            top: getTopByStartTime(hoveredCourse, cur.day, false),
            height: getCourseBlockHeight(hoveredCourse, cur.day, false),
          });
          return acc;
        }, new Map());
      }

      return new Map([["nontime", baseInfo]]);
    }, [hoveredCourse]);

  const selectedCoursesByDay: SelectedCoursesRenderMapType | undefined =
    useMemo(() => {
      const dayMap: SelectedCoursesRenderMapType = new Map();

      if (!semesterSelectedCourses) {
        return undefined;
      }

      semesterSelectedCourses.forEach((selectedCourse, index) => {
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
              top: getTopByStartTime(selectedCourse, curDay, false),
              height: getCourseBlockHeight(selectedCourse, curDay, false),
              colorIndex: (index % (COURSE_BLOCK_BG_COLORS.length - 1)) + 1,
            });
            dayMap.set(curDay, newCoursesInCurDay);
          });
        }
      });

      return dayMap;
    }, [semesterSelectedCourses]);

  return (
    <motion.div
      initial={{
        height: isOpen
          ? `calc(${100 - COURSE_FINDER_HEIGHT}dvh - 52px)`
          : "100%",
      }}
      animate={{
        height: isOpen
          ? // 밑의 52px은 헤더(TimetableTitle)의 높이
            `calc(${100 - COURSE_FINDER_HEIGHT}dvh - 52px)`
          : "100%",
      }}
      transition={{
        duration: 1,
        ease: "easeInOut",
      }}
      className={clsx("relative flex w-full flex-col gap-10")}
    >
      <TimeTableGrid
        selectedCoursesByDay={selectedCoursesByDay}
        hoveredCourseByDay={hoveredCourseByDay}
        isCPSATResult={false}
      />
      {selectedCoursesByDay && selectedCoursesByDay.get("nontimes") && (
        <OnlineCourseListForTimetable
          onlineCourses={selectedCoursesByDay.get("nontimes")!}
        />
      )}
    </motion.div>
  );
}
