import { create } from "zustand";
import {
  CourseFinderSliceType,
  createCourseFinderSlice,
} from "./courseFinder.slice";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import {
  createHoveredCourseSlice,
  HoveredCourseSliceType,
} from "./hoveredCourse.slice";

type StoreType = CourseFinderSliceType & HoveredCourseSliceType;

export const useHSUStore = create<StoreType>()(
  devtools(
    persist(
      subscribeWithSelector((...a) => ({
        ...createCourseFinderSlice(...a),
        ...createHoveredCourseSlice(...a),
      })),
      {
        name: "SchedulerState",
        //   persist를 적용하고 싶은 state를 밑에 명시
        partialize: (state) => ({}),
      },
    ),
  ),
);
