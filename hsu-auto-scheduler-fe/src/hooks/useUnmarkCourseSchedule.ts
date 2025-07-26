import { useTimetableStore } from "@/store/store";
import getHourIndexFromMins from "@/utils/getHourIndexFromMins";
import { useShallow } from "zustand/shallow";

export default function useUnmarkCourseSchedule() {
  const { selectedCourses, deleteCourse, deleteSelectedTimeRange } =
    useTimetableStore(
      useShallow((state) => ({
        selectedCourses: state.selectedCourses,
        deleteCourse: state.deleteCourse,
        deleteSelectedTimeRange: state.deleteSelectedTimeRange,
      })),
    );

  const deleteCourseAndUnmark = (
    courseId: string,
    courseName: string,
    classSection: string,
  ) => {
    const shouldDelete = confirm(
      `${courseName}-${classSection}반을 삭제하시겠습니까?`,
    );
    if (!shouldDelete) return;

    const targetCourse = selectedCourses.find(
      (course) => course.course_id === courseId,
    );

    if (targetCourse) {
      deleteCourse(courseId);
      for (const targetCourseOfflineSchdule of targetCourse.offline_schedules) {
        const day = targetCourseOfflineSchdule.day;
        const startIndex = getHourIndexFromMins(
          targetCourseOfflineSchdule.start_time,
        );
        const endIndex = getHourIndexFromMins(
          targetCourseOfflineSchdule.end_time,
        );

        deleteSelectedTimeRange(day, startIndex, endIndex);
      }
    } else {
      alert(`${courseName}-${classSection}반을 찾을 수 없습니다`);
      return;
    }
  };

  return { deleteCourseAndUnmark };
}
