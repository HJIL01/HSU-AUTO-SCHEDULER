import { WeekdayKorMap, WeekdayOrder } from "@/enums/weekday.enum";
import { PersonalScheduleType } from "@/types/schemas/PersonalSchedule.schema";
import { formatMinToHour } from "@/utils/formatMinToHour";
import clsx from "clsx";

type Props = {
  personalSchedule: PersonalScheduleType;
  index: number;
  handleEditPersonalSchedule: () => void;
};

export default function PersonalScheduleCard({
  personalSchedule,
  index,
  handleEditPersonalSchedule,
}: Props) {
  return (
    <div
      className={clsx(
        "w-full overflow-hidden rounded-2xl border-2 border-[#e3e8ff] px-8 py-7 transition-all duration-300",
        "hover:border-deep-hsu hover:shadow-hsu/20 hover:-translate-y-2 hover:shadow-lg",
      )}
      style={{
        background: "linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)",
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-hsu text-sm font-bold">{`${index + 1}. ${personalSchedule.schedule_name}`}</h3>
        <div className="flex gap-2">
          <button
            className={clsx(
              "bg-hsu/10 text-hsu rounded-lg px-4 py-3 text-xs",
              "hover:bg-hsu/20",
            )}
            onClick={handleEditPersonalSchedule}
          >
            수정
          </button>
          <button
            className={clsx(
              "rounded-lg bg-red-600/10 px-4 py-3 text-xs text-red-600",
              "hover:bg-red-600/20",
            )}
          >
            삭제
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-600">
        {personalSchedule.offline_schedules
          .sort((a, b) => WeekdayOrder[a.day] - WeekdayOrder[b.day])
          .map((offlineSchedule, i) => (
            <div key={i}>
              {WeekdayKorMap[offlineSchedule.day]}요일 /{" "}
              {formatMinToHour(offlineSchedule.start_time)} ~{" "}
              {formatMinToHour(offlineSchedule.end_time)}
              {offlineSchedule.place && ` / ${offlineSchedule.place}`}
            </div>
          ))}
      </div>
    </div>
  );
}
