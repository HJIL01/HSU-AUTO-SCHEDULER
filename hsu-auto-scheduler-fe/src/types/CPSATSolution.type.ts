import { CourseType } from "./schemas/Course.schema";

export type CPSATSolutionType = {
  solution_index: string;
  total_credit: number;
  total_course_gap: number;
  total_online_course_count: number;
  selected_courses: CourseType[];
};
