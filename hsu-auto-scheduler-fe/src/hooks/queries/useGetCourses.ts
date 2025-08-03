import { COURSES_PER_PAGE } from "@/constants/CoursesPerPage";
import { FilterType } from "@/types/filter.type";
import { ResponseType } from "@/types/response.type";
import { CourseType } from "@/types/schemas/Course.schema";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function useGetCourses(filters: FilterType) {
  return useInfiniteQuery({
    queryKey: [
      "courses",
      filters.semester_id,
      filters.major_code,
      filters.grade,
      JSON.stringify(filters.no_class_days),
      filters.day_or_night,
      JSON.stringify(filters.selected_courses),
      JSON.stringify(filters.personal_schedules),
      filters.has_lunch_break,
    ],
    queryFn: async ({
      pageParam,
    }: {
      pageParam: number;
    }): Promise<ResponseType<CourseType[]>> => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/schedule/get-courses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            {
              currentPage: pageParam,
              pagePerLimit: COURSES_PER_PAGE,
              filters,
            },
            null,
            0,
          ),
        },
      );

      if (!res.ok) {
        throw new Error("Get Courses HTTP ERROR!");
      }

      return res.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.data.length < COURSES_PER_PAGE) {
        return undefined;
      }

      return lastPageParam + 1;
    },
  });
}
