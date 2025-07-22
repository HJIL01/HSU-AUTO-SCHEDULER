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

  return (
    <div className="max-h-[500px] overflow-y-auto">
      <table className="w-full border">
        <thead className="sticky top-0 border bg-white [&_th]:border [&_th]:py-4 [&_th]:text-xs [&_th]:whitespace-nowrap">
          <tr>
            <th>
              과목코드
              <div className="fixed text-red-500">과목코드</div>
            </th>
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
        <tbody className="[&_td]:text-center">
          {courses?.map((course) => (
            <CourseInfoTableRow key={course.course_id} courseInfo={course} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
