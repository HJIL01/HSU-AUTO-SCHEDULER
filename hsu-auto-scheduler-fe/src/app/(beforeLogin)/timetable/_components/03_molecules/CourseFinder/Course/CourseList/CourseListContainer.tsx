"use client";

import { useResponsiveContext } from "@/components/ResponsiveProvider";
import SpinSangSangBoogi from "@/components/ui/SpinSangSangBoogi";
import { useInfiniteScroll } from "@/hooks/CourseFinder/Course/CourseList/useInfinityScroll";
import { CourseType } from "@/types/schemas/Course.schema";
import CourseListForDesktop from "./CourseListForDesktop";
import CourseListForMobile from "./CourseListForMobile";

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
    // 밑에서 50px을 뺀 이유는 옵저버의 높이가 h-32(64px)이기 때문
    <div className="h-[calc(100%-64px)] w-full overflow-y-auto">
      {deviceType === "desktop" ? (
        <CourseListForDesktop isLoading={isLoading} courses={courses} />
      ) : (
        <CourseListForMobile isLoading={isLoading} courses={courses} />
      )}

      {courses && hasNextPage && (
        <div
          role="status"
          aria-live="polite"
          // ref={observer}
          className="flex h-32 w-full items-center justify-center"
        >
          <SpinSangSangBoogi className="w-12" />
        </div>
      )}
    </div>
  );
}
