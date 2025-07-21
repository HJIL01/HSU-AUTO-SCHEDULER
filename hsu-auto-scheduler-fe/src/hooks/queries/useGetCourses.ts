import { CourseType } from "@/types/course.type";
import { FilterType } from "@/types/filter.type";
import { ResponseType } from "@/types/response.type";
import { useQuery } from "@tanstack/react-query";

export default function useGetCourses(filters: FilterType) {
  console.log(filters);
  return useQuery({
    queryKey: ["courses", JSON.stringify(filters)],
    queryFn: async (): Promise<ResponseType<CourseType>[]> => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/schedule/get-courses`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) {
        throw new Error("Get Courses HTTP ERROR!");
      }

      return res.json();
    },
  });
}
