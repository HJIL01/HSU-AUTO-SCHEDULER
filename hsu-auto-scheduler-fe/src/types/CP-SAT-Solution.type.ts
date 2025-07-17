import { WeekdayEnum } from "@/enums/weekday.enum";
import { CourseType } from "./course.type";

export type SelectedCoursesType = { [key in WeekdayEnum]: CourseType[] } & {
  nontimes: CourseType[];
};

export type CPSAT_SolutionType = {
  solution_index: string;
  selected_courses: SelectedCoursesType;
  total_credit: number;
  total_course_gap: number;
};
