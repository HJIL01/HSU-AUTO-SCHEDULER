import { WeekdayEnum } from "@/enums/weekday.enum";
import { OfflineScheduleType } from "./schemas/OfflineSchedule.schema";

export type SelectedCoursesRenderMapType = Map<
  WeekdayEnum | "nontimes",
  CourseRenderInfoType[]
>;

export type HoverCourseRenderMapType = Map<
  WeekdayEnum | "nontimes",
  CourseRenderInfoType
>;

export type CourseRenderInfoType = {
  courseId: string;
  courseName: string;
  courseClassSection: string;
  professors: string[];
  colorIndex: number;
  offlineSchedule?: OfflineScheduleType;
  top?: number;
  height?: number;
};
