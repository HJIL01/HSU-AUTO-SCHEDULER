"use client";

import { useHSUStore } from "@/store/store";
import { useShallow } from "zustand/shallow";

export default function page() {
  const { isOpen, setOpen, setClose } = useHSUStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      setOpen: state.setOpen,
      setClose: state.setClose,
    })),
  );
  return (
    <div>
      <button onClick={setOpen}>열기</button>
      {isOpen ? "열림" : "닫힘"}
      <button onClick={setClose}>닫기</button>
    </div>
  );
}
