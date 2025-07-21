import { DayOrNightEnum } from "@/enums/dayOrNight.enum";
import { WeekdayEnum } from "@/enums/weekday.enum";
import { CourseType } from "./schemas/Course.schema";
import { PersonalScheduleType } from "./schemas/PersonalSchedule.schema";

export type FilterType = {
  semester_id: string;

  major_code?: string | null;

  grade?: number | null;

  day_or_night?: DayOrNightEnum | null;

  no_class_days: WeekdayEnum[];

  has_lunch_break: boolean;

  personal_schedules: PersonalScheduleType[];

  selected_courses: CourseType[];
};
