import { WeekdayEnum } from "@/enums/weekday.enum";
import { OfflineScheduleType } from "./schemas/OfflineScheduel.schema";

export type CourseRenderMapType = Map<
  WeekdayEnum | "nontime",
  CourseRenderInfoType[]
>;

export type HoverCourseRenderMapType = Map<
  WeekdayEnum | "nontime",
  CourseRenderInfoType
>;

export type CourseRenderInfoType = {
  courseId: string;
  courseName: string;
  professors: string[];
  offlineSchedule?: OfflineScheduleType;
  top?: number;
  height?: number;
};
