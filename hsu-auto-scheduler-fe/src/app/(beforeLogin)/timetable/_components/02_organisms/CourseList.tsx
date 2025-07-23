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
import CourseInfoTableRow from "../03_molecules/CourseInfoTableRow";
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
  console.log(courses);

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

      {isPending ? (
        <div className="bg-filter-courses-table-body-bg flex h-[calc(100%-36px)] w-full flex-col items-center justify-center text-2xl">
          <div className="animate-spin-sangsangboogi h-auto w-42">
            <Image src={SangSangBoogi} alt="상상부기" />
          </div>
          로딩중...
        </div>
      ) : (
        <table className="w-full table-fixed border-collapse border border-t-0 [&_tr]:h-22">
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
          <tbody className="bg-filter-courses-table-body-bg [&_td]:text-center">
            {courses?.map((course) => (
              <CourseInfoTableRow key={course.course_id} courseInfo={course} />
            ))}
          </tbody>
        </table>
      )}
      {courses && courses.length >= 50 && (
        <div className="flex h-25 w-full items-center justify-center border border-t-0">
          <div className="animate-spin-sangsangboogi h-20 w-fit">
            <Image src={SangSangBoogi} alt="상상부기" />
          </div>
        </div>
      )}
    </div>
  );
}
