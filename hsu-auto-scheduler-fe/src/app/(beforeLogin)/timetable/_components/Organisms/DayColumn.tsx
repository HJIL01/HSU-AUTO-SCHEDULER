import { COURSE_CELL_HEIGHT } from "@/constants/CourseCellHeight";
import { WeekdayEnum } from "@/enums/weekday.enum";
import { getTopByStartTime } from "@/utils/getTopByStartTime";
import clsx from "clsx";
import { getCourseBlockHeight } from "@/utils/getCourseBlockHeight";
import { getOfflineScheduleInCurDay } from "@/utils/getOfflineScheduleInCurDay";
import { CourseType } from "@/types/schemas/Course.schema";

type Props = {
  day: WeekdayEnum;
  hours: number[];
  coursesInCurDay: CourseType[];
};

const bgClass = [
  "bg-course-block-1",
  "bg-course-block-2",
  "bg-course-block-3",
  "bg-course-block-4",
  "bg-course-block-5",
  "bg-course-block-6",
  "bg-course-block-7",
  "bg-course-block-8",
  "bg-course-block-9",
  "bg-course-block-10",
  "bg-course-block-11",
  "bg-course-block-12",
  "bg-course-block-13",
  "bg-course-block-14",
  "bg-course-block-15",
];

export default function DayColumn({ day, hours, coursesInCurDay }: Props) {
  return (
    <td data-day={day} className="relative">
      {hours.map((hour, i) => (
        <div
          key={hour}
          className={clsx(
            "min-w-20",
            i !== 0 && "border-scheduler-cell-border border-t",
          )}
          style={{
            height: `${COURSE_CELL_HEIGHT}px`,
          }}
        />
      ))}

      {coursesInCurDay.map((course) => {
        if (!course.offline_schedules) {
          return;
        }

        const offsetTop = getTopByStartTime(course, day);
        const courseBlockHeight = getCourseBlockHeight(course, day);
        const courseOfflineScheduleInCurDay = getOfflineScheduleInCurDay(
          course,
          day,
        );
        const randomBg = bgClass[Math.floor(Math.random() * bgClass.length)];

        return (
          <div
            key={course.course_id}
            className={clsx(
              "border-y-scheduler-cell-border absolute top-0 z-50 w-full overflow-hidden border-y p-2",
              randomBg,
            )}
            style={{
              top: `${offsetTop}px`,
              height: `${courseBlockHeight}px`,
            }}
          >
            <h2 className="text-xs font-extrabold">{course.course_name}</h2>
            <h4 className="font-semibold">{course.professor_names}</h4>
            <span>{courseOfflineScheduleInCurDay!.place}</span>
          </div>
        );
      })}
    </td>
  );
}
