"use client";

import { useEffect, useMemo } from "react";
import clsx from "clsx";
import { useShallow } from "zustand/shallow";
import { motion } from "framer-motion";
import { COURSE_FINDER_HEIGHT } from "@/constants/CourseFinderHeight";
import TimeTableGrid from "../../03_molecules/Timetable/TimeTableGrid";
import {
  CourseRenderInfoType,
  HoverCourseByDayType,
  SelectedCoursesByDayType,
} from "@/types/courseRender.type";
import { getOfflineScheduleInCurDay } from "@/utils/getOfflineScheduleInCurDay";
import { getTopByStartTime } from "@/utils/getTopByStartTime";
import { useTimetableStore } from "@/store/timetable/timetableStore";
import useCurrentSemester from "@/hooks/common/useCurrentSemester";
import { getBlockHeight } from "@/utils/getBlockHeight";
import { PersonalSchedulesByDayType } from "@/types/personalScheduleRender.type";
import PersonalScheduleModal from "../../05_modals/PersonalScheduleModal";
import groupCoursesByDay from "@/utils/groupCoursesByDay";
import groupPersonalScheduleByDay from "@/utils/groupPersonalSchedulesByDay";
import OnlineCourseList from "../../03_molecules/Timetable/OnlineCourseList";

export default function TimeTableBody() {
  const currentSemester = useCurrentSemester();
  const {
    isOpen,
    hoveredCourse,
    selectedCourses,
    ensureSelectedCoursesSemesterInitialized,
    personalSchedules,
    ensurePersonalSchedulesSemesterInitialized,
    personalScheduleModalIsOpen,
  } = useTimetableStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      hoveredCourse: state.hoveredCourse,
      selectedCourses: state.selectedCourses,
      ensureSelectedCoursesSemesterInitialized:
        state.ensureSelectedCoursesSemesterInitialized,
      personalSchedules: state.personalSchedules,
      ensurePersonalSchedulesSemesterInitialized:
        state.ensurePersonalSchedulesSemesterInitialized,
      personalScheduleModalIsOpen: state.personalScheduleModalIsOpen,
    })),
  );

  const selectedCoursesInCurSemester = selectedCourses[currentSemester];
  const personalSchedulesInCurSemester = personalSchedules[currentSemester];

  useEffect(() => {
    if (!selectedCoursesInCurSemester) {
      ensureSelectedCoursesSemesterInitialized(currentSemester);
    }

    if (!personalSchedulesInCurSemester) {
      ensurePersonalSchedulesSemesterInitialized(currentSemester);
    }
  }, [
    currentSemester,
    selectedCoursesInCurSemester,
    ensureSelectedCoursesSemesterInitialized,
    personalSchedulesInCurSemester,
    ensurePersonalSchedulesSemesterInitialized,
  ]);

  const hoveredCourseByDay: HoverCourseByDayType | undefined = useMemo(() => {
    if (!hoveredCourse) return undefined;

    const baseInfo: CourseRenderInfoType = {
      courseId: hoveredCourse.course_id,
      courseName: hoveredCourse.course_name,
      courseClassSection: hoveredCourse.class_section,
      professors: hoveredCourse.professor_names,
      colorIndex: 0,
    };

    // 오프라인 스케줄이 있을 경우
    if (hoveredCourse.offline_schedules.length > 0) {
      return hoveredCourse.offline_schedules.reduce((acc, cur) => {
        if (!acc[cur.day]) {
          acc[cur.day] = {
            ...baseInfo,
            offlineSchedule: getOfflineScheduleInCurDay(hoveredCourse, cur.day),
            top: getTopByStartTime(cur.start_time, false),
            height: getBlockHeight(cur.start_time, cur.end_time, false),
          };
        }

        return acc;
      }, {} as HoverCourseByDayType);
    }
    // 온라인이거나 오프라인 스케줄이 없을 경우
    else {
      return { nontimes: baseInfo };
    }
  }, [hoveredCourse]);

  const selectedCoursesByDay: SelectedCoursesByDayType | undefined =
    useMemo(() => {
      if (!selectedCoursesInCurSemester) {
        return undefined;
      }

      return groupCoursesByDay(selectedCoursesInCurSemester, false);
    }, [selectedCoursesInCurSemester]);

  const personalSchedulesByDay: PersonalSchedulesByDayType | undefined =
    useMemo(() => {
      if (!personalSchedulesInCurSemester) {
        return undefined;
      }

      return groupPersonalScheduleByDay(personalSchedulesInCurSemester, false);
    }, [personalSchedulesInCurSemester]);

  return (
    <motion.div
      initial={{
        height: isOpen
          ? `calc(${100 - COURSE_FINDER_HEIGHT}dvh - 52px)`
          : "auto",
      }}
      animate={{
        height: isOpen
          ? // 밑의 52px은 헤더(TimetableTitle)의 높이
            `calc(${100 - COURSE_FINDER_HEIGHT}dvh - 52px)`
          : "auto",
      }}
      transition={{
        duration: 1,
        ease: "easeInOut",
      }}
      className={clsx("relative flex h-fit w-full flex-col")}
    >
      <TimeTableGrid
        hoveredCourseByDay={hoveredCourseByDay}
        selectedCoursesByDay={selectedCoursesByDay}
        personalSchedulesByDay={personalSchedulesByDay}
        isCPSATResult={false}
      />
      {selectedCoursesByDay && selectedCoursesByDay["nontimes"] && (
        <OnlineCourseList
          onlineCourses={selectedCoursesByDay["nontimes"]}
          isCPSATResult={false}
        />
      )}

      {personalScheduleModalIsOpen && <PersonalScheduleModal />}
    </motion.div>
  );
}
