"use client";

import useGetCourses from "@/hooks/queries/useGetCourses";
import { DayOrNightEnum } from "@/enums/dayOrNight.enum";
import { FilterType } from "@/types/filter.type";
import { useMemo } from "react";
import { splitSemester } from "@/utils/splitSemester";
import { useFormContext } from "react-hook-form";
import { CreateCPSATschemaType } from "@/types/schemas/CreateCPSAT.schema";
import { WeekdayEnum } from "@/enums/weekday.enum";
import CourseFilters from "../../03_molecules/CourseFinder/CourseFilters";
import CourseList from "../../03_molecules/CourseFinder/CourseList";

export default function CourseTab() {
  const { watch } = useFormContext<CreateCPSATschemaType>();
  const semester = watch("semester");
  const major_code = watch("major_code");
  const grade = watch("grade");
  const day_or_night = watch("day_or_night");
  const no_class_days = watch("no_class_days");
  const has_lunch_break = watch("has_lunch_break");
  const personal_schedules = watch("personal_schedules");
  const selected_courses = watch("selected_courses");
  const maxCredit = watch("max_credit");

  const filters: FilterType = useMemo(() => {
    const semester_id = splitSemester(semester);

    return {
      semester_id,
      major_code: major_code || null,
      grade: grade ? +grade : null,
      day_or_night: (day_or_night as DayOrNightEnum) || null,
      no_class_days: (no_class_days as WeekdayEnum[]) || [],
      has_lunch_break: !!has_lunch_break,
      personal_schedules: personal_schedules || [],
      selected_courses: selected_courses || [],
    };
  }, [
    semester,
    major_code,
    grade,
    day_or_night,
    no_class_days,
    has_lunch_break,
    personal_schedules,
    selected_courses,
  ]);

  const { data, isLoading, hasNextPage, fetchNextPage } =
    useGetCourses(filters);

  const courses = data?.pages.flatMap((e) => e.data);

  const hasEnoughData = useMemo(() => {
    if (!courses) return false;
    let sum = 0;
    for (const course of courses) {
      sum += course.credit;
      if (sum >= maxCredit) return true;
    }

    return false;
  }, [courses]);

  return (
    <div className="h-full w-full space-y-8">
      <CourseFilters hasEnoughData={hasEnoughData} />
      <CourseList
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isLoading={isLoading}
        courses={courses}
      />
    </div>
  );
}
