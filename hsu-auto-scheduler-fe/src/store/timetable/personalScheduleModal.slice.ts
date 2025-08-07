import { StateCreator } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type PersonalScheduleModalStateType = {
  personalScheduleModalIsOpen: boolean;
  formType: "edit" | "add";
};

type PersonalScheduleModalActionType = {
  setPersonalScheduleModalOpen: () => void;
  setPersonalScheduleModalClose: () => void;
  setFormType: (formType: "edit" | "add") => void;
};

export type PersonalScheduleModalSliceType = PersonalScheduleModalStateType &
  PersonalScheduleModalActionType;

const initialState: PersonalScheduleModalStateType = {
  personalScheduleModalIsOpen: false,
  formType: "edit",
};

export const createPersonalScheduleModalSlice: StateCreator<
  PersonalScheduleModalSliceType,
  [],
  [["zustand/immer", never]],
  PersonalScheduleModalSliceType
> = immer(
  combine(initialState, (set) => ({
    setPersonalScheduleModalOpen: () =>
      set({ personalScheduleModalIsOpen: true }),
    setPersonalScheduleModalClose: () =>
      set({ personalScheduleModalIsOpen: false }),
    setFormType: (formType: "edit" | "add") =>
      set((state) => {
        state.formType = formType;
      }),
  })),
);
