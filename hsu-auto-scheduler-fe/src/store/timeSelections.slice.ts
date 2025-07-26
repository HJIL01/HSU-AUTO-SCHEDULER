import { HOURS } from "@/constants/hours";
import { WeekdayEnum } from "@/enums/weekday.enum";
import { StateCreator } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type TimeSelectionStateType = {
  timeSelectionsByDay: Map<WeekdayEnum, number[]>;
};

type TimeSelectionActionType = {
  isOverlap: (
    day: WeekdayEnum,
    startIndex: number,
    endIndex: number,
  ) => boolean;
  selectTimeRange: (
    day: WeekdayEnum,
    startIndex: number,
    endIndex: number,
  ) => void;
  deleteSelectedTimeRange: (
    day: WeekdayEnum,
    startIndex: number,
    endIndex: number,
  ) => void;
};

export type TimeSelectionSliceType = TimeSelectionStateType &
  TimeSelectionActionType;

const initialState: TimeSelectionStateType = {
  timeSelectionsByDay: new Map(
    Object.values(WeekdayEnum).map((day) => [day, Array(HOURS.length).fill(0)]),
  ),
};

export const createTimeSelectionSlice: StateCreator<
  TimeSelectionSliceType,
  [],
  [["zustand/immer", never]],
  TimeSelectionSliceType
> = immer(
  combine(initialState, (set, get) => ({
    isOverlap: (day, startIndex, endIndex) => {
      const { timeSelectionsByDay } = get();
      const dayTimes = timeSelectionsByDay.get(day);
      if (dayTimes) {
        for (let i = startIndex; i < endIndex; i++) {
          if (dayTimes[i]) {
            return true;
          }
        }
      }

      return false;
    },
    selectTimeRange: (day, startIndex, endIndex) => {
      set((state) => {
        const dayTimes = state.timeSelectionsByDay.get(day);
        if (dayTimes) {
          for (let i = startIndex; i < endIndex; i++) {
            dayTimes[i] = 1;
          }
        }
      });
    },
    deleteSelectedTimeRange: (day, startIndex, endIndex) => {
      set((state) => {
        const dayTimes = state.timeSelectionsByDay.get(day);
        if (dayTimes) {
          for (let i = startIndex; i < endIndex; i++) {
            dayTimes[i] = 0;
          }
        }
      });
    },
  })),
);
