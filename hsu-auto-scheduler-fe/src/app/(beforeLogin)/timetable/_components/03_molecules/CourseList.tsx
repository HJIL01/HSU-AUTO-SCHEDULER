"use client";

import CustomSkeleton from "@/components/ui/CustomSkeleton";
import { DayOrNightEnum } from "@/enums/dayOrNight.enum";
import { WeekdayEnum } from "@/enums/weekday.enum";
import useGetCourses from "@/hooks/queries/useGetCourses";
import { FilterType } from "@/types/filter.type";
import { CreateCPSATschemaType } from "@/types/schemas/CreateCPSAT.schema";
import { splitSemester } from "@/utils/splitSemester";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import CourseInfoTableRow from "../04_atoms/CourseInfoTableRow";
import SangSangBoogi from "@/assets/SangSangBoogi.webp";
import Image from "next/image";

export default function CourseList() {
  const { watch } = useFormContext<CreateCPSATschemaType>();
  const values = watch();

  const filters: FilterType = useMemo(() => {
    const { semester, ...rest } = values;
    const semester_id = splitSemester(semester);

    return {
      semester_id,
      major_code: rest.major_code || null,
      grade: rest.grade ? +rest.grade : null,
      day_or_night: (rest.day_or_night as DayOrNightEnum) || null,
      no_class_days: (rest.no_class_days as WeekdayEnum[]) || [],
      has_lunch_break: !!rest.has_lunch_break,
      personal_schedules: rest.personal_schedules || [],
      selected_courses: rest.selected_courses || [],
    };
  }, [values]);

  const { data: getCoursesResponse, isPending } = useGetCourses(filters);

  const courses = getCoursesResponse?.data.slice(0, 50);

  return <div className="">sadad</div>;
}
