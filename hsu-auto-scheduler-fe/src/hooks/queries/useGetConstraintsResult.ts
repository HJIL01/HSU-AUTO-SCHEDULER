import { useQuery } from "@tanstack/react-query";

export default function useGetConstraintsResult() {
  return useQuery({
    queryKey: ["cp-sat result"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/schedule/constraints`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            semester_id: "20252",
            major_code: "V024",
            grade: 3,
            day_or_night: "day",
            no_class_days: ["Mon", "Fri", "Sat", "Sun"],
            personal_schedules: [],
            selected_courses: [],
            max_credit: 18,
            major_foundation: 0,
            major_required: 3,
            major_elective: 0,
            daily_lecture_limit: 3,
            has_lunch_break: false,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("CP-SAT Result HTTP ERROR!");
      }

      return response.json();
    },
    enabled: false,
  });
}
