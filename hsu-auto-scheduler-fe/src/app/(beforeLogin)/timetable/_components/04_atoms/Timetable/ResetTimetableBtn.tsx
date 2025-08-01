"use client";

import useCurrentSemester from "@/hooks/useCurrentSemester";
import { useTimetableStore } from "@/store/timetable/timetableStore";
import { useShallow } from "zustand/shallow";

export default function ResetTimetableBtn() {
  const currentSemester = useCurrentSemester();
  const { resetSelectedCourses, resetTimeSelection } = useTimetableStore(
    useShallow((state) => ({
      resetSelectedCourses: state.resetSelectedCourses,
      resetTimeSelection: state.resetTimeSelection,
    })),
  );

  const handleResetTimetableStore = (semester: string) => {
    const shouldReset = confirm(`${semester}의 시간표를 초기화하시겠습니까?`);

    if (shouldReset) {
      resetSelectedCourses(semester);
      resetTimeSelection(semester);
    }
  };
  return (
    <button
      className="mr-3 rounded-lg bg-white px-3 py-3 text-xs"
      onClick={() => handleResetTimetableStore(currentSemester)}
    >
      시간표 초기화
    </button>
  );
}
