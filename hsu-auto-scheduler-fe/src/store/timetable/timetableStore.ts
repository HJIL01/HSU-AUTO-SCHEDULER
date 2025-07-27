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

type TimetableStoreType = CourseFinderSliceType &
  HoveredCourseSliceType &
  SelectedCourseSliceType &
  TimeSelectionSliceType;

export const useTimetableStore = create<TimetableStoreType>()(
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
        partialize: (state) => ({
          selectedCourses: state.selectedCourses,
          timetableSelections: state.timetableSelections,
        }),
      },
    ),
  ),
);
