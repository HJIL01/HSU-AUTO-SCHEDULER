import { create } from "zustand";
import {
  CPSATResultSliceType,
  createCPSATResultSlice,
} from "./CPSATResult.slice";
import { devtools, subscribeWithSelector } from "zustand/middleware";

type CPSATResultStoreType = CPSATResultSliceType;

export const useCPSATResultStore = create<CPSATResultStoreType>()(
  devtools(
    subscribeWithSelector((...a) => ({
      ...createCPSATResultSlice(...a),
    })),
  ),
);
