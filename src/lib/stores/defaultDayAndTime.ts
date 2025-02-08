import { create } from "zustand";
import { days } from "../constants";
import { Time } from "../classes/Time";

interface DefaultDayAndTimeStore {
  defaultDay: (typeof days)[number] | null;
  defaultTime: Time | null;
  setDefaultDay: (day: (typeof days)[number] | null) => void;
  setDefaultTime: (time: Time | null) => void;
}

export const useDefaultDayAndTimeStore = create<DefaultDayAndTimeStore>(
  (set) => ({
    defaultDay: null,
    defaultTime: null,
    setDefaultDay(day) {
      set({ defaultDay: day });
    },
    setDefaultTime(time) {
      set({ defaultTime: time });
    },
  }),
);
