import { WeekdayEnum } from "@/enums/weekday.enum";

export type FilterType = {
  currentSemester: string;
  currentMajor?: string;
  currentGrade?: number;
  currentDayOrNight?: string;
  currentNoClassDays: WeekdayEnum[];
  currentMaxCredit: number;
  currentMajorFoundation: number;
  currentMajorRequired: number;
  currentMajorElective: number;
  currentDailyLectureLimit: number;
  currentHasLunchBreak: boolean;
};
