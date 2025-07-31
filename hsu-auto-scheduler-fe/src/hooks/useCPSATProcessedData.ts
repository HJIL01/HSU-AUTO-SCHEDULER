import { useEffect, useState } from "react";
import useGetCPSATResults from "./queries/useGetCPSATResults";

export default function useCPSATProcessedData() {
  const [totalSolutionCount, setTotalSolutionCount] = useState<number>(0);

  const { data } = useGetCPSATResults();

  useEffect(() => {
    if (data) {
      setTotalSolutionCount(data.pages[0].data.total_solution_count);
    }
  }, [data, setTotalSolutionCount]);

  const CPSATResult =
    data?.pages.flatMap((e) => {
      return e.data.solutions;
    }) ?? [];

  return {
    totalSolutionCount,
    CPSATResult,
  };
}
