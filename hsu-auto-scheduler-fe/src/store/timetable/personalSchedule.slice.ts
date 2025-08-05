import { PersonalScheduleType } from "@/types/schemas/PersonalSchedule.schema";
import { StateCreator } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type PersonalScheduleStateType = {
  personalSchedules: Record<string, PersonalScheduleType[]>;
};

type PersonalScheduleActionType = {
  ensurePersonalScheduleSemesterInitialized: (semester: string) => void;
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
    personalScheduleId: string,
  ) => void;
  resetPersonalSchedules: (semester: string) => void;
};

const initialState: PersonalScheduleStateType = {
  personalSchedules: {},
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
    ensurePersonalScheduleSemesterInitialized: (semester: string) => {
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
        personalSchedulesInCurSemester.push(personalSchedule);
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

    updatePersonalSchedule: (semester: string, personalScheduleId: string) => {
      console.log(semester, personalScheduleId);
    },

    resetPersonalSchedules: (semester: string) => {
      set((state) => {
        state.personalSchedules[semester] = [];
      });
    },
  })),
);
