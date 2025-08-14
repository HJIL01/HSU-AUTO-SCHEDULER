import { StateCreator } from "zustand";
import { combine } from "zustand/middleware";

type CourseFinderStateType = {
  isOpen: boolean;
  courseFinderHeight: number;
};

type CourseFinderActionType = {
  setOpen: () => void;
  setClose: () => void;
  setCourseFinderHeight: (newHeight: number) => void;
};

export type CourseFinderSliceType = CourseFinderStateType &
  CourseFinderActionType;

const initialState: CourseFinderStateType = {
  isOpen: false,
  courseFinderHeight: 48,
};

export const createCourseFinderSlice: StateCreator<CourseFinderSliceType> =
  combine(initialState, (set) => ({
    setOpen: () => set({ isOpen: true }),
    setClose: () => set({ isOpen: false }),
    setCourseFinderHeight: (newHeight: number) =>
      set({
        courseFinderHeight: newHeight,
      }),
  }));
