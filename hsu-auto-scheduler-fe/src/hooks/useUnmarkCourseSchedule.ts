import { useTimetableStore } from "@/store/timetable/timetableStore";
import { useShallow } from "zustand/shallow";
import useCurrentSemester from "./useCurrentSemester";
import calcMinIndex from "@/utils/getTimeIndex";

export default function useUnmarkCourseSchedule() {
  const { selectedCourses, deleteCourse, deleteSelectedTimeRange } =
    useTimetableStore(
      useShallow((state) => ({
        selectedCourses: state.selectedCourses,
        deleteCourse: state.deleteCourse,
        deleteSelectedTimeRange: state.deleteSelectedTimeRange,
      })),
    );

  const currentSemester = useCurrentSemester();

  const deleteCourseAndUnmark = (
    courseId: string,
    courseName: string,
    classSection: string,
  ) => {
    const shouldDelete = confirm(
      `${courseName}-${classSection}반을 삭제하시겠습니까?`,
    );
    if (!shouldDelete) return;

    const targetCourse = selectedCourses[currentSemester].find(
      (course) => course.course_id === courseId,
    );

    if (targetCourse) {
      deleteCourse(currentSemester, courseId);
      for (const targetCourseOfflineSchdule of targetCourse.offline_schedules) {
        const day = targetCourseOfflineSchdule.day;
        const startIndex = calcMinIndex(targetCourseOfflineSchdule.start_time);
        const endIndex = calcMinIndex(targetCourseOfflineSchdule.end_time);

        deleteSelectedTimeRange(currentSemester, day, startIndex, endIndex);
      }
    } else {
      alert(`${courseName}-${classSection}반을 찾을 수 없습니다`);
      return;
    }
  };

  return { deleteCourseAndUnmark };
}
