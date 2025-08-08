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
import clsx from "clsx";

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
    <div
      className={clsx(
        "flex gap-2",
        "[&_button]:bg-hsu [&_button]:h-fit [&_button]:rounded-lg [&_button]:px-3 [&_button]:py-5",
        "[&_button]:text-xs [&_button]:whitespace-nowrap [&_button]:text-white",
      )}
    >
      <button onClick={onReset}>필터 초기화</button>
      <FetchCPSATResult hasEnoughData={hasEnoughData} />
    </div>
  );
}
