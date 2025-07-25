import { useTimeTableStore } from "@/store/store";
import { CourseType } from "@/types/schemas/Course.schema";
import getHourIndexFromMins from "@/utils/getHourIndexFromMins";
import { useShallow } from "zustand/shallow";

export default function useMarkCourseSchedule() {
  const {
    isCourseAdded,
    addCourse,
    isOverlap,
    selectTimeRange,
    clearHoveredCourse,
  } = useTimeTableStore(
    useShallow((state) => ({
      selectedCourses: state.selectedCourses,
      isCourseAdded: state.isCourseAdded,
      addCourse: state.addCourse,
      isOverlap: state.isOverlap,
      selectTimeRange: state.selectTimeRange,
      clearHoveredCourse: state.clearHoveredCourse,
    })),
  );

  // 클릭 없이 추가랑 마크만 하는 함수
  const addCourseAndMark = (course: CourseType) => {
    for (const offlineSchedule of course.offline_schedules) {
      const curDay = offlineSchedule.day;
      const startIndex = getHourIndexFromMins(offlineSchedule.start_time);
      const endIndex = getHourIndexFromMins(offlineSchedule.end_time);

      if (isOverlap(curDay, startIndex, endIndex)) {
        alert("이미 같은 시간대에 추가된 스케줄이 있습니다");
        return;
      }
    }

    addCourse(course);
    for (const offlineSchedule of course.offline_schedules) {
      const curDay = offlineSchedule.day;
      const startIndex = getHourIndexFromMins(offlineSchedule.start_time);
      const endIndex = getHourIndexFromMins(offlineSchedule.end_time);
      selectTimeRange(curDay, startIndex, endIndex);
    }
  };

  // 클릭 시 추가랑 마크, 호버 상태 없애는 함수
  const onClickCourse = (course: CourseType) => {
    if (isCourseAdded(course.course_id)) {
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
