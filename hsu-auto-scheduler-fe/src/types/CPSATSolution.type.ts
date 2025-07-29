import { WeekdayEnum } from "@/enums/weekday.enum";
import { CourseType } from "./schemas/Course.schema";

export type CPSATSolutionType = {
  solution_index: string;
  selected_courses: CourseType[];
  total_credit: number;
  total_course_gap: number;
};
