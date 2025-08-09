import { WeekdayKorMap, WeekdayOrder } from "@/enums/weekday.enum";
import usePersonalScheduleModal from "@/hooks/usePersonalScheduleModal";
import { PersonalScheduleType } from "@/types/schemas/PersonalSchedule.schema";
import { formatTimeString } from "@/utils/formatTimeString";
import clsx from "clsx";

type Props = {
  personalSchedule: PersonalScheduleType;
  index: number;
};

export default function PersonalScheduleCard({
  personalSchedule,
  index,
}: Props) {
  const { handleEditPersonalSchedule, handleDeletePersonalSchedule } =
    usePersonalScheduleModal();

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
        <h3 className="text-hsu text-sm font-bold">{`${index + 1}. ${personalSchedule.personal_schedule_name}`}</h3>
        <div className="flex gap-2">
          <button
            className={clsx(
              "bg-hsu/10 text-hsu rounded-lg px-4 py-3 text-xs whitespace-nowrap",
              "hover:bg-hsu/20",
            )}
            onClick={() =>
              handleEditPersonalSchedule(personalSchedule.personal_schedule_id)
            }
          >
            수정
          </button>
          <button
            className={clsx(
              "rounded-lg bg-red-600/10 px-4 py-3 text-xs whitespace-nowrap text-red-600",
              "hover:bg-red-600/20",
            )}
            onClick={() =>
              handleDeletePersonalSchedule(
                personalSchedule.personal_schedule_id,
                personalSchedule.personal_schedule_name,
              )
            }
          >
            삭제
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-600">
        {[...personalSchedule.offline_schedules]
          .sort((a, b) => WeekdayOrder[a.day] - WeekdayOrder[b.day])
          .map((offlineSchedule, i) => (
            <div key={i}>
              {WeekdayKorMap[offlineSchedule.day]}요일 /{" "}
              {formatTimeString(offlineSchedule.start_time)} ~{" "}
              {formatTimeString(offlineSchedule.end_time)}
              {offlineSchedule.place && ` / ${offlineSchedule.place}`}
            </div>
          ))}
      </div>
    </div>
  );
}
