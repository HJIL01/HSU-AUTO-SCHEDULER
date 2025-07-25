"use client";

import { useTimeTableStore } from "@/store/store";
import { useShallow } from "zustand/shallow";

export default function TimeTableEditButton() {
  const { setOpen } = useTimeTableStore(
    useShallow((state) => ({
      setOpen: state.setOpen,
    })),
  );
  return (
    <div className="fixed right-12 bottom-12 z-[99999]">
      <button onClick={setOpen} className="text-2xl">
        수업 추가 및 시간표 자동 생성
      </button>
      <button>개인 일정 추가</button>
    </div>
  );
}
