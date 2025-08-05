import { WeekdayEnum } from "@/enums/weekday.enum";
import { OfflineScheduleType } from "./schemas/OfflineSchedule.schema";

export type SelectedCoursesByDayType = Partial<
  Record<WeekdayEnum | "nontimes", CourseRenderInfoType[]>
>;

export type HoverCourseByDayType = Partial<
  Record<WeekdayEnum | "nontimes", CourseRenderInfoType>
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
