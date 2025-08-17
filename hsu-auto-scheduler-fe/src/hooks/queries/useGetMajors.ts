import getMajors from "@/api/getMajors";
import { useQuery } from "@tanstack/react-query";

export function useGetMajors(currentSemester: string) {
  return useQuery({
    queryKey: ["majors", currentSemester],
    queryFn: () => getMajors(currentSemester),
  });
}
