"use client";

import { useResponsiveContext } from "@/components/ResponsiveProvider";
import SpinSangSangBoogi from "@/components/ui/SpinSangSangBoogi";
import { useInfiniteScroll } from "@/hooks/CourseFinder/Course/CourseList/useInfinityScroll";
import { CourseType } from "@/types/schemas/Course.schema";
import CourseListForDesktop from "./CourseListForDesktop";
import CourseListForMobile from "./CourseListForMobile";
import clsx from "clsx";

type Props = {
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isLoading: boolean;
  courses?: CourseType[];
};

export default function CourseListContainer({
  hasNextPage,
  fetchNextPage,
  isLoading,
  courses,
}: Props) {
  const observer = useInfiniteScroll({ hasNextPage, fetchNextPage });
  const deviceType = useResponsiveContext();

  return (
    // 밑의 calc 식은 courseFilters의 전체 높이(패딩, 마진, 높이 포함)를 뺀 계산식임
    // 데스크탑 기준 높이 64px, space-y-8(16px) = 80px
    // 모바일 기준 높이 104px, space-y-8(16px) = 120px
    <div
      className={clsx(
        "h-[calc(100%-80px)] w-full overflow-y-auto",
        "max-md:h-[calc(100%-120px)]",
      )}
    >
      {deviceType === "desktop" ? (
        <CourseListForDesktop isLoading={isLoading} courses={courses} />
      ) : (
        <CourseListForMobile isLoading={isLoading} courses={courses} />
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
