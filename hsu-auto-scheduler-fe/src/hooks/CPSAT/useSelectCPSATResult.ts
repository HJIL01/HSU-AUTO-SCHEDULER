import { useTimetableStore } from "@/store/timetable/timetableStore";
import { useShallow } from "zustand/shallow";

export default function useCPSATResult() {
  const { selectedCourses, personalSchedules, timeSelections } =
    useTimetableStore(
      useShallow((state) => ({
        selectedCourses: state.selectedCourses,
        personalSchedules: state.personalSchedules,
        timeSelections: state.timeSelections,
      })),
    );
}
