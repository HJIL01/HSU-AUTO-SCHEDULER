import { COURSE_CELL_HEIGHT } from "@/constants/CourseCellHeight";
import { WeekdayEnum } from "@/enums/weekday.enum";
import { getCourseBlockHeight } from "@/lib/getCourseBlockHeight";
import { getOfflineScheduleInCurDay } from "@/lib/getOfflineScheduleInCurDay";
import { getTopByStartTime } from "@/lib/getTopByStartTime";
import { CourseType } from "@/types/course.type";
import clsx from "clsx";

type Props = {
  day: WeekdayEnum;
  hours: number[];
  coursesInCurDay: CourseType[];
};

export default function DayColumn({ day, hours, coursesInCurDay }: Props) {
  return (
    <td data-day={day} className="relative">
      {hours.map((hour, i) => (
        <div
          key={hour}
          className={clsx("min-w-20", i !== 0 && "border-t")}
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
        return (
          <div
            key={course.course_id}
            className="absolute top-0 z-50 w-full overflow-hidden border-y border-b-amber-950 bg-red-500 p-2"
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
