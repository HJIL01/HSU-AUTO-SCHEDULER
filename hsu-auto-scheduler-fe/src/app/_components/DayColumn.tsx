import { WeekdayEnum } from "@/enums/weekday.enum";
import { getOfflineScheduleInCurDay } from "@/lib/getOfflineScheduleInCurDay";
import { CourseType } from "@/types/course.type";
import clsx from "clsx";

type Props = {
  day: WeekdayEnum;
  hours: number[];
  coursesInCurDay: CourseType[];
};

export default function DayColumn({ day, hours, coursesInCurDay }: Props) {
  // console.log(day, coursesInCurDay);
  return (
    <td data-day={day} className="relative">
      {hours.map((hour, i) => (
        <div key={hour} className={clsx("h-30", i !== 0 && "border-t")} />
      ))}

      {coursesInCurDay.map((course) => {
        const targetOfflineSchedule = getOfflineScheduleInCurDay(course, day);
        return (
          <div
            key={course.course_id}
            className="absolute top-0 z-50 w-full bg-red-500"
          >
            테스트으
          </div>
        );
      })}
    </td>
  );
}
