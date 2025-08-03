import { create } from "zustand";
import {
  createPersonalScheduleModalSlice,
  PersonalScheduleModalSliceType,
} from "./personalScheduleModal.slice";
import { devtools, subscribeWithSelector } from "zustand/middleware";

type PersonalScheduleStoreType = PersonalScheduleModalSliceType;

export const usePersonalScheduleStore = create<PersonalScheduleStoreType>()(
  devtools(
    subscribeWithSelector((...a) => ({
      ...createPersonalScheduleModalSlice(...a),
    })),
  ),
);
