import { create } from "zustand";
import {
  CourseFinderSliceType,
  createCourseFinderSlice,
} from "./courseFinder.slice";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type StoreType = CourseFinderSliceType;

export const useHSUStore = create<StoreType>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((...a) => ({ ...createCourseFinderSlice(...a) })),
      ),
      {
        name: "SchedulerState",
        //   persist를 적용하고 싶은 state를 밑에 명시
        partialize: (state) => ({}),
      },
    ),
  ),
);
