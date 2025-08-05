import { useTimetableStore } from "@/store/timetable/timetableStore";
import { PersonalScheduleType } from "@/types/schemas/PersonalSchedule.schema";
import { useShallow } from "zustand/shallow";
import useCurrentSemester from "./useCurrentSemester";
import { WeekdayEnum, WeekdayKorMap } from "@/enums/weekday.enum";
import { OfflineScheduleType } from "@/types/schemas/OfflineSchedule.schema";
import isOverlapPersonalScheduleTimes from "@/utils/isOverlapPersonalScheduleTimes";
import calcMinIndex from "@/utils/getHourIndexFromMins";

export default function useMarkPersonalSchedule() {
  const currentSemester = useCurrentSemester();

  const {
    isOverlap,
    ensurePersonalSchedulesSemesterInitialized,
    addPersonalSchedule,
    ensureTimeSelectionInitialized,
    selectTimeRange,
    setPersonalScheduleModalClose,
  } = useTimetableStore(
    useShallow((state) => ({
      isOverlap: state.isOverlap,
      ensurePersonalSchedulesSemesterInitialized:
        state.ensurePersonalSchedulesSemesterInitialized,
      addPersonalSchedule: state.addPersonalSchedule,
      ensureTimeSelectionInitialized: state.ensureTimeSelectionInitialized,
      selectTimeRange: state.selectTimeRange,
      setPersonalScheduleModalClose: state.setPersonalScheduleModalClose,
    })),
  );

  const addPersonalScheduleAndMark = (
    personalSchedule: PersonalScheduleType,
  ) => {
    ensurePersonalSchedulesSemesterInitialized(currentSemester);
    ensureTimeSelectionInitialized(currentSemester);

    const offline_schedules = personalSchedule.offline_schedules;

    const groupedByDay: Record<WeekdayEnum, OfflineScheduleType[]> =
      offline_schedules.reduce(
        (acc, cur) => {
          const newPersonalSchedulesInCurDay = acc[cur.day] ?? [];

          newPersonalSchedulesInCurDay.push(cur);

          acc[cur.day] = newPersonalSchedulesInCurDay;

          return acc;
        },
        {} as Record<WeekdayEnum, OfflineScheduleType[]>,
      );

    // 현재 개인 스케줄의 시간대끼리의 검사
    // day를 추출할 수 없으므로 검사하는 밑의 함수에서 alter창과 함께 day 메시지를 띄우도록
    // 이후에 더 좋은 방법 있으면 코드 리팩토링 필요
    if (isOverlapPersonalScheduleTimes(groupedByDay)) {
      return;
    }

    // 기존 시간표에 등록하려는 개인 스케줄의 시간대와 겹치는 시간이 있는지 검사
    // 오프라인 스케줄이 여러개가 있을 수 있으므로 해당 오프라인 스케줄을 다 돌면서 timeSelections의 isOverlap으로 검사
    for (const day in groupedByDay) {
      const offlineSchedulesInCurDay = groupedByDay[day as WeekdayEnum];

      for (const offlineSchedule of offlineSchedulesInCurDay) {
        const startIndex = calcMinIndex(offlineSchedule.start_time);
        const endIndex = calcMinIndex(offlineSchedule.end_time);
        if (
          isOverlap(currentSemester, day as WeekdayEnum, startIndex, endIndex)
        ) {
          alert(
            `${WeekdayKorMap[day as WeekdayEnum]}요일의 같은 시간대에 이미 등록된 스케줄이 있습니다!`,
          );
          return;
        }
      }
    }

    // 개인 스케줄에 추가
    addPersonalSchedule(currentSemester, personalSchedule);

    // timeSelections에 추가
    for (const day in groupedByDay) {
      const offlineSchedulesInCurDay = groupedByDay[day as WeekdayEnum];

      for (const offlineSchedule of offlineSchedulesInCurDay) {
        const startIndex = calcMinIndex(offlineSchedule.start_time);
        const endIndex = calcMinIndex(offlineSchedule.end_time);

        selectTimeRange(
          currentSemester,
          day as WeekdayEnum,
          startIndex,
          endIndex,
        );
      }
    }

    // 모달 닫기
    setPersonalScheduleModalClose();
  };

  return { addPersonalScheduleAndMark };
}
