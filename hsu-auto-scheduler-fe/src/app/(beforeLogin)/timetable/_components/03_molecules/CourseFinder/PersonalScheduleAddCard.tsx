import Plus from "@/assets/icons/Plus";
import clsx from "clsx";

type Props = {
  handleAddPersonalSchedule: () => void;
};

export default function PersonalScheduleAddCard({
  handleAddPersonalSchedule,
}: Props) {
  return (
    <div
      className={clsx(
        "flex w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-[#c8d4ff]",
        "hover:border-deep-hsu hover:shadow-hsu/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg",
      )}
      style={{
        background: "linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)",
      }}
      onClick={handleAddPersonalSchedule}
    >
      <div className="bg-deep-hsu flex aspect-square w-20 items-center justify-center rounded-full text-xl text-white">
        <Plus className="w-6" />
      </div>
      <div className="text-hsu text-sm font-semibold">새 스케줄 추가</div>
    </div>
  );
}
