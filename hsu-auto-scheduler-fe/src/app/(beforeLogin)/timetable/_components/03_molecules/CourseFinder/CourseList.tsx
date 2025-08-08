"use client";

import SpinSangSangBoogi from "@/components/ui/SpinSangSangBoogi";
import SangSangBoogi from "@/assets/SangSangBoogi.webp";
import Image from "next/image";
import { useInfiniteScroll } from "@/hooks/useInfinityScroll";
import { CourseType } from "@/types/schemas/Course.schema";
import CourseInfoTableRow from "../../04_atoms/CourseFinder/CourseInfoTableRow";
import clsx from "clsx";

type Props = {
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isLoading: boolean;
  courses?: CourseType[];
};

export default function CourseList({
  hasNextPage,
  fetchNextPage,
  isLoading,
  courses,
}: Props) {
  const observer = useInfiniteScroll({ hasNextPage, fetchNextPage });

  return (
    // 밑에서 50px을 뺀 이유는 옵저버의 높이가 h-32(64px)이기 때문
    <div className="h-[calc(100%-64px)] w-full overflow-y-auto">
      <table
        className={clsx(
          "sticky top-0 h-18 w-full table-fixed",
          "[&_th]:text-xs [&_th]:text-white",
          "[&_th]:font-semibold",
        )}
      >
        <colgroup
          className={clsx(
            "[&_col]:bg-[linear-gradient(135deg,var(--color-hsu)_0%,var(--color-deep-hsu)_100%)]",
          )}
        >
          {/* 과목코드 */}
          <col className="w-50" />
          {/* 과목명 */}
          <col className="min-w-50" />
          {/* 교수 */}
          <col className="w-48" />
          {/* 학년 */}
          <col className="w-31" />
          {/* 학년제한 */}
          <col className="w-30" />
          {/* 학점 */}
          <col className="w-20" />
          {/* 과목구분 */}
          <col className="w-31" />
          {/* 이수구분 */}
          <col className="w-33" />
          {/* 주/야 */}
          <col className="w-20" />
          {/* 강의 스케줄 */}
          <col className="min-w-130" />
          {/* 강의 계획서 */}
          <col className="w-42" />
        </colgroup>
        <thead>
          <tr>
            <th>과목코드</th>
            <th>과목명</th>
            <th>교수</th>
            <th>학년</th>
            <th>학년제한</th>
            <th>학점</th>
            <th>과목구분</th>
            <th>이수구분</th>
            <th>주/야</th>
            <th>강의 스케줄</th>
            <th>강의 계획서</th>
          </tr>
        </thead>
      </table>

      {isLoading ? (
        <div className="bg-course-finder-courses-table-row-bg flex h-[calc(100%-36px)] w-full flex-col items-center justify-center text-2xl">
          <SpinSangSangBoogi className="w-42" />
          로딩중...
        </div>
      ) : (
        <table className="w-full table-fixed border-collapse [&_tr]:h-22">
          <colgroup>
            {/* 과목코드 */}
            <col className="w-50" />
            {/* 과목명 */}
            <col className="min-w-50" />
            {/* 교수 */}
            <col className="w-48" />
            {/* 학년 */}
            <col className="w-31" />
            {/* 학년제한 */}
            <col className="w-30" />
            {/* 학점 */}
            <col className="w-20" />
            {/* 과목구분 */}
            <col className="w-31" />
            {/* 이수구분 */}
            <col className="w-33" />
            {/* 주/야 */}
            <col className="w-20" />
            {/* 강의 스케줄 */}
            <col className="min-w-130" />
            {/* 강의 계획서 */}
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
                  <CourseInfoTableRow key={course.course_id} course={course} />
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
          className="flex h-32 w-full items-center justify-center"
        >
          <SpinSangSangBoogi className="w-12" />
        </div>
      )}
    </div>
  );
}
