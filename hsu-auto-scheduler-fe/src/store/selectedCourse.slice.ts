import { CourseType } from "@/types/schemas/Course.schema";
import { StateCreator } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type SelectedCourseStateType = {
  selectedCourses: Record<string, CourseType[]>;
};

type SelectedCourseActionType = {
  ensureSemesterInitialized: (semester: string) => void;
  isCourseAdded: (semester: string, courseId: string) => boolean;
  addCourse: (semester: string, course: CourseType) => void;
  deleteCourse: (semester: string, courseId: string) => void;
};

export type SelectedCourseSliceType = SelectedCourseStateType &
  SelectedCourseActionType;

const initialState: SelectedCourseStateType = {
  selectedCourses: {},
};

export const createSelectedCourseSlice: StateCreator<
  SelectedCourseSliceType,
  [],
  [["zustand/immer", never]],
  SelectedCourseSliceType
> = immer(
  combine(initialState, (set, get) => ({
    ensureSemesterInitialized: (semester: string) => {
      const currentSelectedCourses = get().selectedCourses[semester];

      if (!currentSelectedCourses) {
        set((state) => {
          state.selectedCourses[semester] = [];
        });
      }
    },
    isCourseAdded: (semester: string, courseId: string) => {
      const semesterCourses = get().selectedCourses[semester] ?? [];
      return semesterCourses.some((c) => c.course_id === courseId);
    },
    addCourse: (semester: string, course: CourseType) =>
      set((state) => {
        const semesterCourses = state.selectedCourses[semester] ?? [];
        semesterCourses.push(course);
        state.selectedCourses[semester] = semesterCourses;
      }),
    deleteCourse: (semester: string, courseId: string) => {
      set((state) => {
        const semesterCourses = state.selectedCourses[semester] ?? [];
        state.selectedCourses[semester] = semesterCourses.filter(
          (c) => c.course_id !== courseId,
        );
      });
    },
  })),
);
