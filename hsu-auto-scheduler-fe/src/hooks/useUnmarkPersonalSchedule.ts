import { useTimetableStore } from "@/store/timetable/timetableStore";
import { useShallow } from "zustand/shallow";
import useCurrentSemester from "./useCurrentSemester";
import calcMinIndex from "@/utils/getHourIndexFromMins";

export default function useUnmarkPersonalSchedule() {
  const { personalSchedules, deletePersonalSchedule, deleteSelectedTimeRange } =
    useTimetableStore(
      useShallow((state) => ({
        personalSchedules: state.personalSchedules,
        deletePersonalSchedule: state.deletePersonalSchedule,
        deleteSelectedTimeRange: state.deleteSelectedTimeRange,
      })),
    );

  const currentSemester = useCurrentSemester();

  const deletePersonalScheduleAndUnMark = (
    targetPersonalScheduleId: string,
    personalScheduleName: string,
  ) => {
    const shouldDelete = confirm(`${personalScheduleName}을 삭제하시겠습니까?`);
    if (!shouldDelete) return;

    const targetPersonalSchedule = personalSchedules[currentSemester].find(
      (personalSchedule) =>
        personalSchedule.personal_schedule_id === targetPersonalScheduleId,
    );

    if (targetPersonalSchedule) {
      deletePersonalSchedule(currentSemester, targetPersonalScheduleId);

      for (const offlineSchedule of targetPersonalSchedule.offline_schedules) {
        const day = offlineSchedule.day;
        const startIndex = calcMinIndex(offlineSchedule.start_time);
        const endIndex = calcMinIndex(offlineSchedule.end_time);

        deleteSelectedTimeRange(currentSemester, day, startIndex, endIndex);
      }
    } else {
      alert(`${personalScheduleName}을 찾을 수 없습니다`);
      return;
    }
  };

  return { deletePersonalScheduleAndUnMark };
}
