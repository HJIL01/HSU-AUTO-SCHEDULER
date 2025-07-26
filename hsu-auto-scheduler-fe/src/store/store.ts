import { enableMapSet } from "immer";
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
import {
  createSelectedCourseSlice,
  SelectedCourseSliceType,
} from "./selectedCourse.slice";
import {
  createTimeSelectionSlice,
  TimeSelectionSliceType,
} from "./timeSelections.slice";

enableMapSet();

type StoreType = CourseFinderSliceType &
  HoveredCourseSliceType &
  SelectedCourseSliceType &
  TimeSelectionSliceType;

export const useTimetableStore = create<StoreType>()(
  devtools(
    persist(
      subscribeWithSelector((...a) => ({
        ...createCourseFinderSlice(...a),
        ...createHoveredCourseSlice(...a),
        ...createSelectedCourseSlice(...a),
        ...createTimeSelectionSlice(...a),
      })),
      {
        name: "Scheduler-Store",
        //   persist를 적용하고 싶은 state를 밑에 명시
        partialize: (state) => ({}),
      },
    ),
  ),
);
