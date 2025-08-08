import { StateCreator } from "zustand";
import { combine } from "zustand/middleware";

type CPSATResultModalStateType = {
  CPSATResultModalIsOpen: boolean;
};

type CPSATResultModalActionType = {
  setCPSATResultModalOpen: () => void;
  setCPSATResultModalClose: () => void;
};

export type CPSATResultModalSliceType = CPSATResultModalStateType &
  CPSATResultModalActionType;

const initialState: CPSATResultModalStateType = {
  CPSATResultModalIsOpen: false,
};

export const createCPSATResultModalSlice: StateCreator<CPSATResultModalSliceType> =
  combine(initialState, (set) => ({
    setCPSATResultModalOpen: () => set({ CPSATResultModalIsOpen: true }),
    setCPSATResultModalClose: () => set({ CPSATResultModalIsOpen: false }),
  }));
