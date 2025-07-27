import { WeekdayEnum } from "@/enums/weekday.enum";
import { CourseType } from "./schemas/Course.schema";

export type SelectedCoursesType = { [key in WeekdayEnum]: CourseType[] } & {
  nontimes: CourseType[];
};

export type CPSATSolutionType = {
  solution_index: string;
  selected_courses: SelectedCoursesType;
  total_credit: number;
  total_course_gap: number;
};
