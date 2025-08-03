import { StateCreator } from "zustand";
import { combine } from "zustand/middleware";

type PersonalScheduleModalStateType = {
  isOpen: boolean;
  mode: "edit" | "add";
};

type PersonalScheduleModalActionType = {
  setOpen: () => void;
  setClose: () => void;
  setEditMode: () => void;
  setAddMode: () => void;
};

export type PersonalScheduleModalSliceType = PersonalScheduleModalStateType &
  PersonalScheduleModalActionType;

const initialState: PersonalScheduleModalStateType = {
  isOpen: false,
  mode: "edit",
};

export const createPersonalScheduleModalSlice: StateCreator<PersonalScheduleModalSliceType> =
  combine(initialState, (set) => ({
    setOpen: () => set({ isOpen: true }),
    setClose: () => set({ isOpen: false }),
    setEditMode: () => set({ mode: "edit" }),
    setAddMode: () => set({ mode: "add" }),
  }));
