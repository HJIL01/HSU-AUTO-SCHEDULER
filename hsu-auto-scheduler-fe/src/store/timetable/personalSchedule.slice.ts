import { PersonalScheduleType } from "@/types/schemas/PersonalSchedule.schema";
import { findIndex } from "lodash";
import { StateCreator } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type PersonalScheduleStateType = {
  personalSchedules: Record<string, PersonalScheduleType[]>;
  selectedPersonalSchedule: null | PersonalScheduleType;
};

type PersonalScheduleActionType = {
  ensurePersonalSchedulesSemesterInitialized: (semester: string) => void;
  addPersonalSchedule: (
    semester: string,
    personalSchedule: PersonalScheduleType,
  ) => void;
  deletePersonalSchedule: (
    semester: string,
    personalScheduleId: string,
  ) => void;
  updatePersonalSchedule: (
    semester: string,
    newSchedule: PersonalScheduleType,
  ) => void;
  resetPersonalSchedules: (semester: string) => void;
  setSelectedPersonalSchedule: (schedule: PersonalScheduleType | null) => void;
};

const initialState: PersonalScheduleStateType = {
  personalSchedules: {},
  selectedPersonalSchedule: null,
};

export type PersonalScheduleSliceType = PersonalScheduleStateType &
  PersonalScheduleActionType;

export const createPersonalScheduleSlice: StateCreator<
  PersonalScheduleSliceType,
  [],
  [["zustand/immer", never]],
  PersonalScheduleSliceType
> = immer(
  combine(initialState, (set, get) => ({
    ensurePersonalSchedulesSemesterInitialized: (semester: string) => {
      const personalSchedulesInCurSemester = get().personalSchedules[semester];

      if (!personalSchedulesInCurSemester) {
        set((state) => {
          state.personalSchedules[semester] = [];
        });
      }
    },

    addPersonalSchedule: (
      semester: string,
      personalSchedule: PersonalScheduleType,
    ) => {
      set((state) => {
        const personalSchedulesInCurSemester =
          state.personalSchedules[semester] ?? [];

        const cleanedOfflineSchedules = personalSchedule.offline_schedules.map(
          (offlineSchedule) => {
            if (offlineSchedule.place?.trim() === "") {
              return { ...offlineSchedule, place: undefined };
            }
            return offlineSchedule;
          },
        );

        const cleanedPersonalSchedule = {
          ...personalSchedule,
          personal_schedule_name:
            personalSchedule.personal_schedule_name.trim(),
          offline_schedules: cleanedOfflineSchedules,
        };

        personalSchedulesInCurSemester.push(cleanedPersonalSchedule);
        state.personalSchedules[semester] = personalSchedulesInCurSemester;
      });
    },

    deletePersonalSchedule: (semester: string, personalScheduleId: string) => {
      set((state) => {
        const personalSchedulesInCurSemester =
          state.personalSchedules[semester] ?? [];

        state.personalSchedules[semester] =
          personalSchedulesInCurSemester.filter(
            (ps) => ps.personal_schedule_id !== personalScheduleId,
          );
      });
    },

    updatePersonalSchedule: (
      semester: string,
      newSchedule: PersonalScheduleType,
    ) => {
      const targetPersonalScheduleIndex = get().personalSchedules[
        semester
      ].findIndex(
        (personalSchedule) =>
          personalSchedule.personal_schedule_id ===
          newSchedule.personal_schedule_id,
      );

      if (targetPersonalScheduleIndex !== -1) {
        set((state) => {
          const cleanedOfflineSchedules = newSchedule.offline_schedules.map(
            (offlineSchedule) => {
              const trimedOfflineSchedule = offlineSchedule.place?.trim();
              if (trimedOfflineSchedule === "") {
                return { ...offlineSchedule, place: undefined };
              }
              return {
                ...offlineSchedule,
                place: trimedOfflineSchedule,
              };
            },
          );

          const cleanedPersonalSchedule = {
            ...newSchedule,
            personal_schedule_name: newSchedule.personal_schedule_name.trim(),
            offline_schedules: cleanedOfflineSchedules,
          };

          state.personalSchedules[semester][targetPersonalScheduleIndex] =
            cleanedPersonalSchedule;
        });
      } else {
        console.error(
          `${semester}-${newSchedule.personal_schedule_id}: 개인 스케줄 업데이트 에러`,
        );
      }
    },

    resetPersonalSchedules: (semester: string) => {
      set((state) => {
        state.personalSchedules[semester] = [];
      });
    },

    setSelectedPersonalSchedule: (
      personalSchedule: PersonalScheduleType | null,
    ) => {
      set((state) => {
        state.selectedPersonalSchedule = personalSchedule;
      });
    },
  })),
);
