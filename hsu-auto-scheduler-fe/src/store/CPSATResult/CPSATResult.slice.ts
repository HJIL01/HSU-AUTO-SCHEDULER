import { CPSATSolutionType } from "@/types/CPSATSolution.type";
import { StateCreator } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type CPSATResultStateType = {
  totalSolutionCount: number;
  solutions: CPSATSolutionType[];
};

type CPSATResultActionType = {
  setCPSATResult: (result: CPSATResultStateType) => void;
};

export type CPSATResultSliceType = CPSATResultStateType & CPSATResultActionType;

const initialState: CPSATResultStateType = {
  totalSolutionCount: 0,
  solutions: [],
};

export const createCPSATResultSlice: StateCreator<
  CPSATResultSliceType,
  [],
  [["zustand/immer", never]],
  CPSATResultSliceType
> = immer(
  combine(initialState, (set) => ({
    setCPSATResult: (result) =>
      set((state) => {
        state.totalSolutionCount = result.totalSolutionCount;
        state.solutions = result.solutions;
      }),
  })),
);
