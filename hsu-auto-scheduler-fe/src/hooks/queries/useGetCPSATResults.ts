import { useTimetableStore } from "@/store/timetable/timetableStore";
import { CreateCPSATschemaType } from "@/types/schemas/CreateCPSAT.schema";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { useShallow } from "zustand/shallow";
import useCurrentSemester from "../useCurrentSemester";
import { CPSAT_RESULT_PER_PAGE } from "@/constants/CPSATResultPerPage";
import { useEffect } from "react";
import { splitSemester } from "@/utils/splitSemester";
import { CPSATSolutionType } from "@/types/CPSATSolution.type";
import { ResponseType } from "@/types/response.type";

export default function useGetCPSATResults() {
  const currentSemester = useCurrentSemester();
  const { setValue, getValues } = useFormContext<CreateCPSATschemaType>();
  const { semester, ...rest } = getValues();
  const semester_id = splitSemester(semester);

  const { selectedCourses, personalSchedules } = useTimetableStore(
    useShallow((state) => ({
      selectedCourses: state.selectedCourses,
      personalSchedules: state.personalSchedules,
    })),
  );

  // rhf의 selected_courses와 zustand의 selectedCourses는 여기서 동기화됨
  // personal_schedules도 마찬가지
  useEffect(() => {
    setValue("selected_courses", selectedCourses[currentSemester] ?? []);
  }, [currentSemester, selectedCourses, setValue]);

  useEffect(() => {
    setValue("personal_schedules", personalSchedules[currentSemester] ?? []);
  }, [currentSemester, personalSchedules, setValue]);

  return useInfiniteQuery({
    queryKey: ["cp-sat result"],
    queryFn: async ({
      pageParam,
    }: {
      pageParam: number;
    }): Promise<
      ResponseType<{
        total_solution_count: number;
        solutions: CPSATSolutionType[];
      }>
    > => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/schedule/constraints`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPage: pageParam,
            pagePerLimit: CPSAT_RESULT_PER_PAGE,
            semester_id,
            constraints: {
              ...rest,
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error("CP-SAT Result HTTP ERROR!");
      }

      return response.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.data.solutions.length < CPSAT_RESULT_PER_PAGE) {
        return undefined;
      }

      return lastPageParam + 1;
    },
    enabled: false,
  });
}
