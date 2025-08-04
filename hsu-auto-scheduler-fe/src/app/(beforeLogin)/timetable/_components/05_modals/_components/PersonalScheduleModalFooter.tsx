"use client";

import clsx from "clsx";

export default function PersonalScheduleModalFooter() {
  return (
    <div className="border-border-hsu flex justify-end gap-5 border-t bg-[#f8f9fa] px-10 py-8 text-white">
      <button
        className={clsx(
          "bg-cancel-btn-bg rounded-xl px-4 py-3 text-sm font-extrabold transition-all duration-200",
          "hover:-translate-y-1 hover:bg-[#5a6268]",
          "max-md:text-xs",
        )}
      >
        취소
      </button>
      <button
        className={clsx(
          "bg-hsu rounded-xl px-4 py-3 text-sm font-extrabold transition-all duration-200",
          "hover:-translate-y-1 hover:shadow-[0_4px_15px_rgba(46,92,184,0.3)]",
          "max-md:text-xs",
        )}
      >
        저장
      </button>
    </div>
  );
}
