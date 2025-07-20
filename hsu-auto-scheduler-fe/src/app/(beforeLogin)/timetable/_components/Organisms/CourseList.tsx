"use client";

import useGetCourses from "@/hooks/queries/useGetCourses";
import { FilterType } from "@/types/filter.type";
import { SchemaType } from "@/types/schema";
import { use, useState } from "react";
import { useFormContext } from "react-hook-form";

export default function CourseList() {
  const { getValues } = useFormContext<SchemaType>();

  const currentSemester = getValues("semester");
  const currentMajor = getValues("major");
  const currentGrade = +getValues("grade");
  const currentDayOrNight = getValues("dayOrNight");
  const currentNoClassDays = getValues("noClassDays");
  const currentMaxCredit = getValues("maxCredit");
  const currentMajorFoundation = getValues("majorFoundation");
  const currentMajorRequired = getValues("majorRequired");
  const currentMajorElective = getValues("majorElective");
  const currentDailyLectureLimit = getValues("dailyLectureLimit");
  const currentHasLunchBreak = getValues("hasLunchBreak");

  const filter: FilterType = {
    currentSemester,
    currentMajor,
    currentGrade,
    currentDayOrNight,
    currentNoClassDays,
    currentMaxCredit,
    currentMajorFoundation,
    currentMajorRequired,
    currentMajorElective,
    currentDailyLectureLimit,
    currentHasLunchBreak,
  };

  const [test, setTest] = useState(1);

  // const { data: getCoursesResponse } = useGetCourses(filter);
  //   console.log(getCoursesResponse);
  return <div>courseDAta</div>;
}
