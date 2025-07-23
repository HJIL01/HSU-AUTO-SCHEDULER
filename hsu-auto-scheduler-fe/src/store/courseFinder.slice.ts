import { StateCreator } from "zustand";
import { combine } from "zustand/middleware";

type CourseFinderStateType = {
  isOpen: boolean;
};

type CourseFinderActionType = {
  setOpen: () => void;
  setClose: () => void;
};

export type CourseFinderSliceType = CourseFinderStateType &
  CourseFinderActionType;

const initialState: CourseFinderStateType = {
  isOpen: false,
};

export const createCourseFinderSlice: StateCreator<CourseFinderSliceType> =
  combine(initialState, (set) => ({
    setOpen: () => set({ isOpen: true }),
    setClose: () => set({ isOpen: false }),
  }));
