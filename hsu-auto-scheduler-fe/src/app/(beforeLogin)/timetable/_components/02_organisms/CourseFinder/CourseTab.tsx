"use client";

import useGetCourses from "@/hooks/queries/useGetCourses";
import { DayOrNightEnum } from "@/enums/dayOrNight.enum";
import { FilterType } from "@/types/filter.type";
import { useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { CreateCPSATschemaType } from "@/types/schemas/CreateCPSAT.schema";
import { WeekdayEnum } from "@/enums/weekday.enum";
import CourseListContainer from "../../03_molecules/CourseFinder/Course/CourseList/CourseListContainer";
import { useResponsiveContext } from "@/components/ResponsiveProvider";
import CourseFiltersContainer from "../../03_molecules/CourseFinder/Course/Filter/CourseFiltersContainer";

export default function CourseTab() {
  const [search, setSearch] = useState<string>("");

  const formContext = useFormContext<CreateCPSATschemaType>();

  const semester = useWatch({ control: formContext.control, name: "semester" });

  const major_code = useWatch({
    control: formContext.control,
    name: "major_code",
  });

  const grade = useWatch({ control: formContext.control, name: "grade" });

  const day_or_night = useWatch({
    control: formContext.control,
    name: "day_or_night",
  });

  const no_class_days = useWatch({
    control: formContext.control,
    name: "no_class_days",
  });

  const has_lunch_break = useWatch({
    control: formContext.control,
    name: "has_lunch_break",
  });

  const personal_schedules = useWatch({
    control: formContext.control,
    name: "personal_schedules",
  });

  const selected_courses = useWatch({
    control: formContext.control,
    name: "selected_courses",
  });

  const maxCredit = useWatch({
    control: formContext.control,
    name: "max_credit",
  });

  const filters: FilterType = useMemo(() => {
    return {
      semester_id: semester,
      major_code: major_code || null,
      search,
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
    search,
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
  }, [courses, maxCredit]);

  const deviceType = useResponsiveContext();

  return (
    <div className="h-full w-full space-y-8">
      <CourseFiltersContainer
        hasEnoughData={hasEnoughData}
        search={search}
        setSearch={setSearch}
      />
      <CourseListContainer
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isLoading={isLoading}
        courses={courses}
        deviceType={deviceType}
      />
    </div>
  );
}
