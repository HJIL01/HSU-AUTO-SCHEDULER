import getMajors from "@/api/getMajors";
import { useQuery } from "@tanstack/react-query";

export function useGetMajors(currentSemester: string) {
  const [year, term] = currentSemester.split("-");
  return useQuery({
    queryKey: ["majors", currentSemester],
    queryFn: () => getMajors(year, term),
  });
}
