import { create } from "zustand";
import {
  CPSATResultSliceType,
  createCPSATResultSlice,
} from "./CPSATResult.slice";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import {
  CPSATResultModalSliceType,
  createCPSATResultModalSlice,
} from "./CPSATResultModal.slice";

type CPSATResultStoreType = CPSATResultModalSliceType & CPSATResultSliceType;

export const useCPSATResultStore = create<CPSATResultStoreType>()(
  devtools(
    subscribeWithSelector((...a) => ({
      ...createCPSATResultModalSlice(...a),
      ...createCPSATResultSlice(...a),
    })),
  ),
);
