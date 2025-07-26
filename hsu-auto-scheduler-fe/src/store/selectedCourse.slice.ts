import { CourseType } from "@/types/schemas/Course.schema";
import { StateCreator } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type SelectedCourseStateType = {
  selectedCourses: CourseType[];
};

type SelectedCourseActionType = {
  isCourseAdded: (courseId: string) => boolean;
  addCourse: (course: CourseType) => void;
  deleteCourse: (courseId: string) => void;
};

export type SelectedCourseSliceType = SelectedCourseStateType &
  SelectedCourseActionType;

const initialState: SelectedCourseStateType = {
  selectedCourses: [],
};

export const createSelectedCourseSlice: StateCreator<
  SelectedCourseSliceType,
  [],
  [["zustand/immer", never]],
  SelectedCourseSliceType
> = immer(
  combine(initialState, (set, get) => ({
    isCourseAdded: (courseId: string) => {
      return get().selectedCourses.some(
        (selectedCourse) => selectedCourse.course_id === courseId,
      );
    },
    addCourse: (course: CourseType) =>
      set((state) => {
        state.selectedCourses.push(course);
      }),
    deleteCourse: (courseId: string) => {
      set((state) => {
        state.selectedCourses = state.selectedCourses.filter(
          (selectedCourse) => selectedCourse.course_id !== courseId,
        );
      });
    },
  })),
);
