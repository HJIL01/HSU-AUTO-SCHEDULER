"use client";

import getMajors from "@/api/getMajors";
import Chevron from "@/assets/icons/Chevron";
import {
  createCPSATSchemaDefaultValues,
  CreateCPSATschemaType,
} from "@/types/schemas/CreateCPSAT.schema";
import { SemesterType } from "@/types/semester.type";
import { splitSemester } from "@/utils/splitSemester";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  semesters: SemesterType[];
};

export default function TimeTableHeader({ semesters }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { setValue } = useFormContext<CreateCPSATschemaType>();
  const queryClient = useQueryClient();

  const semesterCount = semesters.length;
  const currentSemester =
    searchParams.get("semester") || createCPSATSchemaDefaultValues.semester;

  const [currentIndex, setCurrentIndex] = useState<number>(
    semesters.findIndex(
      (semester) => semester.semester_id === splitSemester(currentSemester),
    ),
  );

  const handlePrevSemester = () => {
    if (currentIndex === 0) {
      return;
    }

    setCurrentIndex((prev) => prev - 1);
  };

  const handleNextSemester = () => {
    if (currentIndex === semesterCount - 1) return;

    setCurrentIndex((prev) => prev + 1);
  };

  useEffect(() => {
    const newSemester = semesters[currentIndex];

    const newSemesterString = `${newSemester.year}-${newSemester.term}`;

    setValue("semester", newSemesterString);

    queryClient.prefetchQuery({
      queryKey: ["majors", newSemesterString],
      queryFn: () => getMajors(newSemesterString),
    });

    router.replace(`timetable?semester=${newSemesterString}`);
  }, [currentIndex, setValue, queryClient]);

  return (
    <header className="text-md relative mx-auto flex h-[20dvh] w-130 items-center justify-center">
      <button
        disabled={currentIndex === 0}
        onClick={handlePrevSemester}
        className="absolute left-0 z-50 disabled:hidden"
      >
        <Chevron />
      </button>
      <div className="w-80 overflow-x-hidden">
        <motion.ul
          initial={{
            x: -100 * currentIndex + "%",
          }}
          animate={{ x: -100 * currentIndex + "%" }}
          transition={{ duration: 0.5 }}
          className="flex w-full"
        >
          {semesters.map((semester) => (
            <li
              key={semester.semester_id}
              className="w-full shrink-0 text-center whitespace-nowrap"
            >
              {semester.year}년 {semester.term}학기
            </li>
          ))}
        </motion.ul>
      </div>
      <button
        disabled={currentIndex === semesterCount - 1}
        onClick={handleNextSemester}
        className="absolute right-0 rotate-y-180 disabled:hidden"
      >
        <Chevron />
      </button>
    </header>
  );
}
