"use client";

import { WeekdayEnum, WeekdayKorMap } from "@/enums/weekday.enum";
import { SelectedCoursesRenderMapType } from "@/types/courseRenderInfo.type";
import { motion } from "framer-motion";

type Props = {
  totalCredit: number;
  onlineCourseCount: number;
  currentIndex: number;
  selectedCoursesByDayList: SelectedCoursesRenderMapType[];
};

export default function CPSATResultInfoSummaryTab({
  totalCredit,
  onlineCourseCount,
  currentIndex,
  selectedCoursesByDayList,
}: Props) {
  return (
    <div className="h-full overflow-x-hidden">
      <motion.div
        className="flex h-full w-full"
        initial={{
          translateX: `-${100 * currentIndex}%`,
        }}
        animate={{
          translateX: `-${currentIndex * 100}%`,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {selectedCoursesByDayList.map((selectedCoursesByDay, i) => (
          <div
            key={i}
            className="flex h-full w-full shrink-0 flex-col gap-3 p-5"
          >
            {Object.values(WeekdayEnum).map((day) => {
              const kor = WeekdayKorMap[day];

              const coursesInCurDay = selectedCoursesByDay.get(day);

              return (
                <div key={day} className="flex gap-2">
                  <h2 className="inline-block text-base font-bold whitespace-nowrap max-md:text-sm max-sm:text-xs">
                    {kor}요일:
                  </h2>
                  {coursesInCurDay ? (
                    <div className="max-sm:text-xxs flex flex-col justify-center text-sm max-md:text-xs">
                      {coursesInCurDay.map((course, i) => (
                        <div key={course.courseId}>
                          <strong>
                            {i + 1}. {course.courseName}(
                            {course.courseClassSection}):{" "}
                            {course.professors.join(", ")}
                          </strong>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="max-sm:text-xxs text-sm max-md:text-xs">
                      공강
                    </span>
                  )}
                </div>
              );
            })}
            {totalCredit}
            {onlineCourseCount}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
