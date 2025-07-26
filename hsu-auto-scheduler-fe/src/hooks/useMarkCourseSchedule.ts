import { useTimetableStore } from "@/store/store";
import { CourseType } from "@/types/schemas/Course.schema";
import getHourIndexFromMins from "@/utils/getHourIndexFromMins";
import { useShallow } from "zustand/shallow";
import useCurrentSemester from "./useCurrentSemester";

export default function useMarkCourseSchedule() {
  const {
    ensureSemesterInitialized,
    isCourseAdded,
    addCourse,
    isOverlap,
    selectTimeRange,
    clearHoveredCourse,
  } = useTimetableStore(
    useShallow((state) => ({
      ensureSemesterInitialized: state.ensureSemesterInitialized,
      selectedCourses: state.selectedCourses,
      isCourseAdded: state.isCourseAdded,
      addCourse: state.addCourse,
      isOverlap: state.isOverlap,
      selectTimeRange: state.selectTimeRange,
      clearHoveredCourse: state.clearHoveredCourse,
    })),
  );

  const currentSemester = useCurrentSemester();

  // 클릭 없이 추가랑 마크만 하는 함수
  // 밑의 클릭 있는 함수를 불러도 이 함수만 부르면 알아서 겹치는지 확인하고 삭제해줌
  const addCourseAndMark = (course: CourseType) => {
    for (const offlineSchedule of course.offline_schedules) {
      const curDay = offlineSchedule.day;
      const startIndex = getHourIndexFromMins(offlineSchedule.start_time);
      const endIndex = getHourIndexFromMins(offlineSchedule.end_time);

      ensureSemesterInitialized(currentSemester);
      if (isOverlap(currentSemester, curDay, startIndex, endIndex)) {
        alert("이미 같은 시간대에 추가된 스케줄이 있습니다");
        return;
      }
    }

    addCourse(currentSemester, course);
    for (const offlineSchedule of course.offline_schedules) {
      const curDay = offlineSchedule.day;
      const startIndex = getHourIndexFromMins(offlineSchedule.start_time);
      const endIndex = getHourIndexFromMins(offlineSchedule.end_time);
      selectTimeRange(currentSemester, curDay, startIndex, endIndex);
    }
  };

  // 클릭 시 추가랑 마크, 호버 상태 없애는 함수
  const onClickCourse = (course: CourseType) => {
    if (isCourseAdded(currentSemester, course.course_id)) {
      alert(
        `${course.course_name}-${course.class_section}반은 이미 추가한 수업입니다`,
      );
      return;
    }

    addCourseAndMark(course);
    clearHoveredCourse();
  };

  return { addCourseAndMark, onClickCourse };
}
