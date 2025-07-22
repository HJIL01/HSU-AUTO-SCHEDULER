import { create } from "zustand";

const useModalStore = create((set) => ({
  isOpen: false,
  setOpen: () => set(() => ({ isOpen: true })),
  setClose: () => set(() => ({ isOpen: false })),
}));
