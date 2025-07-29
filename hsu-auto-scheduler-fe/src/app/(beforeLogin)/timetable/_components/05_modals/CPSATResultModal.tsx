"use client";

import { Dispatch, SetStateAction } from "react";
import TimeTableGrid from "../03_molecules/TimeTableGrid";
import { CPSATSolutionType } from "@/types/CPSATSolution.type";
import Portal from "@/components/Portal";
import {
  CourseRenderInfoType,
  SelectedCoursesRenderMapType,
} from "@/types/courseRenderInfo.type";
import { WeekdayEnum } from "@/enums/weekday.enum";
import { COURSE_BLOCK_BG_COLORS } from "@/constants/CourseBlockBgColors";
import { getTopByStartTime } from "@/utils/getTopByStartTime";
import { getCourseBlockHeight } from "@/utils/getCourseBlockHeight";

type Props = {
  isFetching: boolean;
  setCPSATResultModalIsOpen: Dispatch<SetStateAction<boolean>>;
  CPSATResult?: CPSATSolutionType[];
};

export default function CPSATResultModal({
  isFetching,
  setCPSATResultModalIsOpen,
  CPSATResult,
}: Props) {
  return (
    <Portal>
      {CPSATResult &&
        (CPSATResult.length > 0 ? (
          <div
            className="fixed top-0 left-0 z-(--z-index-CPSATResult-modal) flex h-dvh w-full items-center justify-center bg-black/30"
            onClick={() => setCPSATResultModalIsOpen(false)}
          >
            <div className="bg-course-finder-main-bg aspect-square border">
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
                        top: getTopByStartTime(course, day),
                        height: getCourseBlockHeight(course, day),
                      });

                      selectedCoursesByDay.set(day, newCoursesInCurDay);
                    });
                  }
                });

                return (
                  <TimeTableGrid
                    key={result.solution_index}
                    className="absolute top-1/2 left-1/2 w-full origin-center -translate-1/2 scale-[65%]"
                    selectedCoursesByDay={selectedCoursesByDay}
                    isCPSATResult={true}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <div>해 없음!</div>
        ))}
    </Portal>
  );
}
