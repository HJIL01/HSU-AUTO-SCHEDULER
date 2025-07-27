import { HOURS } from "@/constants/hours";
import { WeekdayEnum } from "@/enums/weekday.enum";
import { StateCreator } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type TimeSelectionStateType = {
  timetableSelections: Record<string, Record<WeekdayEnum, number[]>>;
};

type TimeSelectionActionType = {
  ensureSemesterInitialized: (semester: string) => void;
  isOverlap: (
    semester: string,
    day: WeekdayEnum,
    startIndex: number,
    endIndex: number,
  ) => boolean;
  selectTimeRange: (
    semester: string,
    day: WeekdayEnum,
    startIndex: number,
    endIndex: number,
  ) => void;
  deleteSelectedTimeRange: (
    semester: string,
    day: WeekdayEnum,
    startIndex: number,
    endIndex: number,
  ) => void;
};

export type TimeSelectionSliceType = TimeSelectionStateType &
  TimeSelectionActionType;

const initialState: TimeSelectionStateType = {
  timetableSelections: {},
};

export const createTimeSelectionSlice: StateCreator<
  TimeSelectionSliceType,
  [],
  [["zustand/immer", never]],
  TimeSelectionSliceType
> = immer(
  combine(initialState, (set, get) => ({
    ensureSemesterInitialized: (semester) => {
      const current = get().timetableSelections[semester];
      if (!current) {
        set((state) => {
          state.timetableSelections[semester] = Object.values(
            WeekdayEnum,
          ).reduce(
            (acc, day) => {
              acc[day] = Array(HOURS.length).fill(0);
              return acc;
            },
            {} as Record<WeekdayEnum, number[]>,
          );
        });
      }
    },
    isOverlap: (semester, day, startIndex, endIndex) => {
      const currentTimetableSelections = get().timetableSelections[semester];

      if (!currentTimetableSelections) {
        throw new Error(`${semester}에 해당하는 timetable이 없습니다`);
      }

      const dayTimes = currentTimetableSelections[day];
      if (dayTimes) {
        for (let i = startIndex; i < endIndex; i++) {
          if (dayTimes[i]) {
            return true;
          }
        }
      }

      return false;
    },
    selectTimeRange: (semester, day, startIndex, endIndex) => {
      set((state) => {
        const currentTimetableSelections = state.timetableSelections[semester];

        if (!currentTimetableSelections) {
          throw new Error(`${semester}에 해당하는 timetable이 없습니다`);
        }

        const dayTimes = currentTimetableSelections[day];

        if (dayTimes) {
          for (let i = startIndex; i < endIndex; i++) {
            dayTimes[i] = 1;
          }
        }
      });
    },
    deleteSelectedTimeRange: (semester, day, startIndex, endIndex) => {
      set((state) => {
        const currentTimetableSelections = state.timetableSelections[semester];

        if (!currentTimetableSelections) {
          throw new Error(`${semester}에 해당하는 timetable이 없습니다`);
        }

        const dayTimes = currentTimetableSelections[day];

        if (dayTimes) {
          for (let i = startIndex; i < endIndex; i++) {
            dayTimes[i] = 0;
          }
        }
      });
    },
  })),
);
