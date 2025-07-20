"use client";

import useGetCourses from "@/hooks/queries/useGetCourses";
import { FilterType } from "@/types/filter.type";
import { SchemaType } from "@/types/schema";
import { use, useState } from "react";
import { useFormContext } from "react-hook-form";

export default function CourseList() {
  const { watch } = useFormContext<SchemaType>();

  const currentSemester = watch("semester");
  const currentMajor = watch("major");
  const currentGrade = +watch("grade"); // 문자열 → 숫자 변환
  const currentDayOrNight = watch("dayOrNight");
  const currentNoClassDays = watch("noClassDays");
  const currentMaxCredit = watch("maxCredit");
  const currentMajorFoundation = watch("majorFoundation");
  const currentMajorRequired = watch("majorRequired");
  const currentMajorElective = watch("majorElective");
  const currentDailyLectureLimit = watch("dailyLectureLimit");
  const currentHasLunchBreak = watch("hasLunchBreak");

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

  const { data: getCoursesResponse } = useGetCourses(filter);
  //   console.log(getCoursesResponse);
  return <div>courseDAta</div>;
}
