import { CourseRenderInfoType } from "@/types/courseRenderInfo.type";
import clsx from "clsx";

type Props = {
  onlineCourses: CourseRenderInfoType[];
};

export default function CPSATResultOnlineCoursesTab({ onlineCourses }: Props) {
  return (
    <div className="h-full w-full py-5">
      {onlineCourses.length > 0 ? (
        <>
          {onlineCourses.map((onlineCourse, i) => (
            <div
              key={onlineCourse.courseId}
              className={clsx(
                "border-timetable-cell-border flex gap-2 border-b p-5",
              )}
            >
              <h2 className="inline-block text-sm font-extrabold">
                {i + 1}. {onlineCourse.courseName}(
                {onlineCourse.courseClassSection})
              </h2>
              <span className="max-lg:text-xxl flex items-center pt-[3px] text-xs max-md:text-[.8rem]">
                {onlineCourse.professors.join(", ")}
              </span>
            </div>
          ))}
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-red-500 text-2xl">
          ads
        </div>
      )}
    </div>
  );
}
