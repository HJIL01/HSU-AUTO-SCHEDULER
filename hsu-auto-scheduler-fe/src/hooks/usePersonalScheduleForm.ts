import { WeekdayEnum, WeekdayKorMap } from "@/enums/weekday.enum";
import { useTimetableStore } from "@/store/timetable/timetableStore";
import {
  createOfflineScheduleDefaultValue,
  PersonalScheduleOfflineScheduleType,
} from "@/types/schemas/PersonalScheduleOfflineSchedule.schema";
import { PersonalScheduleType } from "@/types/schemas/PersonalSchedule.schema";
import isOverlapPersonalScheduleTimes from "@/utils/isOverlapPersonalScheduleTimes";
import { SubmitHandler, useFieldArray, useFormContext } from "react-hook-form";
import { useShallow } from "zustand/shallow";
import useCurrentSemester from "./useCurrentSemester";
import calcMinIndex from "@/utils/getHourIndexFromMins";

export default function usePersonalScheduleForm() {
  const currentSemester = useCurrentSemester();

  const { control, setValue, handleSubmit } =
    useFormContext<PersonalScheduleType>();
  const { append, fields, remove } = useFieldArray({
    control,
    name: "offline_schedules",
  });

  const { isOverlap, addPersonalSchedule, selectTimeRange } = useTimetableStore(
    useShallow((state) => ({
      isOverlap: state.isOverlap,
      addPersonalSchedule: state.addPersonalSchedule,
      selectTimeRange: state.selectTimeRange,
    })),
  );

  const onAppend = () => {
    append(createOfflineScheduleDefaultValue());
  };

  const onRemove = (index: number) => {
    if (fields.length === 1) {
      alert("개인 스케줄에는 최소 하나의 일정이 있어야 합니다!");
      return;
    }

    remove(index);
  };

  const onChange = (
    index: number,
    fieldName: keyof PersonalScheduleOfflineScheduleType,
    value: PersonalScheduleOfflineScheduleType[keyof PersonalScheduleOfflineScheduleType],
  ) => {
    setValue(`offline_schedules.${index}.${fieldName}`, value);
  };

  const onSubmit: SubmitHandler<PersonalScheduleType> = (data) => {
    const offline_schedules = data.offline_schedules;

    const groupedByDay: Record<
      WeekdayEnum,
      PersonalScheduleOfflineScheduleType[]
    > = offline_schedules.reduce(
      (acc, cur) => {
        if (!acc[cur.day]) {
        }
        acc[cur.day] = [];
        acc[cur.day].push(cur);

        return acc;
      },
      {} as Record<WeekdayEnum, PersonalScheduleOfflineScheduleType[]>,
    );

    // 현재 개인 스케줄의 시간대끼리의 검사
    if (isOverlapPersonalScheduleTimes(groupedByDay)) {
      return;
    }

    // 기존 시간표에 등록하려는 개인 스케줄의 시간대와 겹치는 시간이 있는지 검사
    for (const day in groupedByDay) {
      const offlineSchedulesInCurDay = groupedByDay[day as WeekdayEnum];

      for (const offlineSchedule of offlineSchedulesInCurDay) {
        const startIndex = calcMinIndex(offlineSchedule.start_time);
        const endIndex = calcMinIndex(offlineSchedule.end_time);
        if (
          isOverlap(currentSemester, day as WeekdayEnum, startIndex, endIndex)
        ) {
          alert(
            `${WeekdayKorMap[day as WeekdayEnum]}요일의 같은 시간대에 스케줄이 있습니다!`,
          );
          return;
        }
      }
    }

    addPersonalSchedule(currentSemester, data);

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
  };

  const submitHandler = handleSubmit(onSubmit);

  return { control, fields, onAppend, onRemove, onChange, submitHandler };
}
