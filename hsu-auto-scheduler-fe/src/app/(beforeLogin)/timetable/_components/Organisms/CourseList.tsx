"use client";

import { DayOrNightEnum } from "@/enums/dayOrNight.enum";
import { WeekdayEnum } from "@/enums/weekday.enum";
import useGetCourses from "@/hooks/queries/useGetCourses";
import { FilterType } from "@/types/filter.type";
import { CreateCPSATschemaType } from "@/types/schemas/CreateCPSAT.schema";
import { OfflineScheduleType } from "@/types/schemas/OfflineScheduel.schema";
import { splitSemester } from "@/utils/splitSemester";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

export default function CourseList() {
  const { watch } = useFormContext<CreateCPSATschemaType>();
  const values = watch();
  console.log(values);

  // const filters: FilterType = useMemo(() => {
  //   const { semester, ...rest } = values;
  //   const semester_id = splitSemester(semester);

  //   return {
  //     semester_id,
  //     major_code: rest.major_code || null,
  //     grade: rest.grade ? +rest.grade : null,
  //     day_or_night: (rest.day_or_night as DayOrNightEnum) || null,
  //     no_class_days: (rest.no_class_days as WeekdayEnum[]) || [],
  //     max_credit: +rest.max_credit,
  //     major_foundation: +rest.major_foundation,
  //     major_required: +rest.major_required,
  //     major_elective: +rest.major_elective,
  //     daily_lecture_limit: +rest.daily_lecture_limit,
  //     has_lunch_break: !!rest.has_lunch_break,
  //     personal_schedules: rest.personal_schedules,
  //     selected_courses: rest.selected_courses || [],
  //   };
  // }, [values]);

  // const { data: getCoursesResponse } = useGetCourses(filters);
  // console.log(getCoursesResponse);
  return <div>courseDAta</div>;
}
