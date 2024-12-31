import { create } from "zustand";
import { days } from "../constants";
import { Time } from "../classes/Time";

interface DefaultDayAndTimeStore {
  day: (typeof days)[number] | null;
  time: Time | null;
  setDay: (day: (typeof days)[number]) => void;
  setTime: (time: Time) => void;
}

export const useDefaultDayAndTimeStore = create<DefaultDayAndTimeStore>(
  (set) => ({
    day: null,
    time: null,
    setDay(day) {
      set({ day });
    },
    setTime(time) {
      set({ time });
    },
  }),
);
