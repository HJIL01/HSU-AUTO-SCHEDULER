"use client";

import { DayOrNightEnum } from "@/enums/dayOrNight.enum";
import { WeekdayEnum } from "@/enums/weekday.enum";
import useGetCourses from "@/hooks/queries/useGetCourses";
import { FilterType } from "@/types/filter.type";
import { CreateCPSATschemaType } from "@/types/schemas/CreateCPSAT.schema";
import { splitSemester } from "@/utils/splitSemester";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import CourseInfoTableRow from "../04_atoms/CourseInfoTableRow";
import SpinSangSangBoogi from "@/components/ui/SpinSangSangBoogi";
import SangSangBoogi from "@/assets/SangSangBoogi.webp";
import Image from "next/image";
import { useInfiniteScroll } from "@/hooks/useInfinityScroll";

export default function CourseList() {
  const { watch } = useFormContext<CreateCPSATschemaType>();
  const semester = watch("semester");
  const major_code = watch("major_code");
  const grade = watch("grade");
  const day_or_night = watch("day_or_night");
  const no_class_days = watch("no_class_days");
  const has_lunch_break = watch("has_lunch_break");
  const personal_schedules = watch("personal_schedules");
  const selected_courses = watch("selected_courses");

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

  const observer = useInfiniteScroll({ hasNextPage, fetchNextPage });

  return (
    <div className="h-full w-full overflow-y-auto">
      <table className="bg-filter-courses-table-head-bg sticky top-0 h-18 w-full table-fixed border-collapse border text-xs [&_th]:border">
        <colgroup>
          <col className="w-40" />
          <col className="min-w-50" />
          <col className="w-48" />
          <col className="w-25" />
          <col className="w-30" />
          <col className="w-30" />
          <col className="w-31" />
          <col className="w-20" />
          <col className="min-w-130" />
          <col className="w-42" />
        </colgroup>
        <thead>
          <tr>
            <th>과목코드</th>
            <th>과목명</th>
            <th>교수</th>
            <th>학년</th>
            <th>학년제한</th>
            <th>이수구분</th>
            <th>과목구분</th>
            <th>주/야</th>
            <th>강의 스케줄</th>
            <th>강의 계획서</th>
          </tr>
        </thead>
      </table>

      {isLoading ? (
        <div className="bg-filter-courses-table-row-bg flex h-[calc(100%-36px)] w-full flex-col items-center justify-center text-2xl">
          <SpinSangSangBoogi className="w-42" />
          로딩중...
        </div>
      ) : (
        <table className="w-full table-fixed border-collapse [&_tr]:h-22">
          <colgroup>
            <col className="w-40" />
            <col className="min-w-50" />
            <col className="w-48" />
            <col className="w-25" />
            <col className="w-30" />
            <col className="w-30" />
            <col className="w-31" />
            <col className="w-20" />
            <col className="min-w-130" />
            <col className="w-42" />
          </colgroup>
          <tbody className="[&_td]:text-center">
            {courses &&
              (courses.length === 0 ? (
                <tr className="text-md !h-100 bg-white">
                  <td colSpan={10}>
                    <div className="flex h-full w-full flex-col items-center justify-center">
                      <div className="mb-2 h-auto w-25">
                        <Image src={SangSangBoogi} alt="상상부기" />
                      </div>
                      검색 결과가 없습니다
                    </div>
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <CourseInfoTableRow
                    key={course.course_id}
                    courseInfo={course}
                  />
                ))
              ))}
          </tbody>
        </table>
      )}

      {courses && hasNextPage && (
        <div
          role="status"
          aria-live="polite"
          ref={observer}
          className="flex h-25 w-full items-center justify-center"
        >
          <SpinSangSangBoogi className="w-12" />
        </div>
      )}
    </div>
  );
}
