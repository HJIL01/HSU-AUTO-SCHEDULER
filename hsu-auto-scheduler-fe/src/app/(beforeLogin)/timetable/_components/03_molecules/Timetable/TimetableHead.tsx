import { DAYS } from "@/constants/days";
import { WeekdayKorMap } from "@/enums/weekday.enum";
import clsx from "clsx";

type Props = {
  isCPSATResult: boolean;
};

export default function TimetableHead({ isCPSATResult }: Props) {
  return (
    <table className="bg-timetable-body-bg w-full border text-sm">
      <colgroup>
        <col className="border-timetable-cell-border w-30 border" />
        {DAYS.map((day) => (
          <col key={day} className="border-timetable-cell-border border" />
        ))}
      </colgroup>

      <thead className="text-hsu">
        <tr className={clsx(isCPSATResult ? "h-16" : "h-25")}>
          <th />
          {DAYS.map((day) => (
            <th key={day}>{WeekdayKorMap[day]}</th>
          ))}
        </tr>
      </thead>
    </table>
  );
}
