import { FilterType } from "@/types/filter.type";
import { ResponseType } from "@/types/response.type";
import { CourseType } from "@/types/schemas/Course.schema";
import { useQuery } from "@tanstack/react-query";

export default function useGetCourses(filters: FilterType) {
  return useQuery({
    queryKey: ["courses", JSON.stringify(filters)],
    queryFn: async (): Promise<ResponseType<CourseType>[]> => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/schedule/get-courses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filters, null, 0),
        },
      );

      if (!res.ok) {
        throw new Error("Get Courses HTTP ERROR!");
      }

      return res.json();
    },
  });
}
