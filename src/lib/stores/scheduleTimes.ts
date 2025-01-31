import { create } from "zustand";
import { Time } from "../classes/Time";
import { Hour } from "../ts/types";

interface ScheduleTimesStore {
  times: Time[];
  addTimes: (newTimes: Time[]) => void;
  removeTime: (time: Time) => void;
  initializeWithDefaultTimes: () => void;
}

export const useScheduleTimesStore = create<ScheduleTimesStore>((set, get) => {
  // private method
  function sortTimes() {
    set((state) => ({
      times: state.times.toSorted((a, b) =>
        a.hour === b.hour ? a.minute - b.minute : a.hour - b.hour,
      ),
    }));
  }

  return {
    times: [],
    addTimes(newTimes) {
      const timesToAdd: Time[] = [];

      for (const newTime of newTimes) {
        const timeExists = get().times.find((time) =>
          Time.equals(time, newTime),
        );

        if (timeExists) {
          timesToAdd.push(timeExists);
        }
      }

      set({ times: get().times.concat(timesToAdd) });
      sortTimes();
    },
    removeTime(time) {
      set({ times: get().times.filter((t) => !Time.equals(t, time)) });
    },
    initializeWithDefaultTimes() {
      set({
        times: Array.from(
          { length: 8 },
          (_, i) => new Time((i + 8) as Hour, 0),
        ),
      });
    },
  };
});
