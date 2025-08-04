import { StateCreator } from "zustand";
import { combine } from "zustand/middleware";

type PersonalScheduleModalStateType = {
  personalScheduleModalIsOpen: boolean;
  mode: "edit" | "add";
};

type PersonalScheduleModalActionType = {
  setPersonalScheduleModalOpen: () => void;
  setPersonalScheduleModalClose: () => void;
  setEditMode: () => void;
  setAddMode: () => void;
};

export type PersonalScheduleModalSliceType = PersonalScheduleModalStateType &
  PersonalScheduleModalActionType;

const initialState: PersonalScheduleModalStateType = {
  personalScheduleModalIsOpen: false,
  mode: "edit",
};

export const createPersonalScheduleModalSlice: StateCreator<PersonalScheduleModalSliceType> =
  combine(initialState, (set) => ({
    setPersonalScheduleModalOpen: () =>
      set({ personalScheduleModalIsOpen: true }),
    setPersonalScheduleModalClose: () =>
      set({ personalScheduleModalIsOpen: false }),
    setEditMode: () => set({ mode: "edit" }),
    setAddMode: () => set({ mode: "add" }),
  }));
