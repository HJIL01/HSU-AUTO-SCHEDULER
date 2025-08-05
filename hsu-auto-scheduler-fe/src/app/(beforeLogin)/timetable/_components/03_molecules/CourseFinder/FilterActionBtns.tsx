"use client";

import { useFormContext } from "react-hook-form";
import FetchCPSATResult from "../../04_atoms/CourseFinder/FetchCPSATResult";
import {
  createCPSATSchemaDefaultValues,
  CreateCPSATschemaType,
} from "@/types/schemas/CreateCPSAT.schema";
import useCurrentSemester from "@/hooks/useCurrentSemester";
import { useTimetableStore } from "@/store/timetable/timetableStore";
import { useShallow } from "zustand/shallow";

type Props = {
  hasEnoughData: boolean;
};

export default function FilterActionBtns({ hasEnoughData }: Props) {
  const currentSemester = useCurrentSemester();
  const { reset } = useFormContext<CreateCPSATschemaType>();
  const { selectedCourses, personalSchedules } = useTimetableStore(
    useShallow((state) => ({
      selectedCourses: state.selectedCourses,
      personalSchedules: state.personalSchedules,
    })),
  );

  const onReset = () => {
    const shouldReset = confirm("필터를 초기화 하시겠습니까?");

    if (!shouldReset) {
      return;
    }

    const {
      semester: _,
      selected_courses: __,
      personal_schedules: ___,
      ...rest
    } = createCPSATSchemaDefaultValues;

    reset({
      semester: currentSemester,
      selected_courses: selectedCourses[currentSemester],
      personal_schedules: personalSchedules[currentSemester],
      ...rest,
    });
  };

  return (
    <div className="flex gap-2">
      <button
        className="bg-hsu h-full rounded-lg px-3 text-xs whitespace-nowrap text-white"
        onClick={onReset}
      >
        필터 초기화
      </button>
      <FetchCPSATResult hasEnoughData={hasEnoughData} />
    </div>
  );
}
