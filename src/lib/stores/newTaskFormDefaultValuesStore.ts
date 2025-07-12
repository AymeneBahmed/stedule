import { create } from "zustand";
import { days } from "../constants";
import { Time } from "../classes/Time";
import { TaskFromStore } from "./tasksStore";

interface NewTaskFormDefaultValuesStore {
  defaultDay: (typeof days)[number] | null;
  defaultTime: Time | null;
  // Used if clicked on an occupied cell in the schedule table
  defaultTask: TaskFromStore | null;
  setDefaultDay: (day: (typeof days)[number] | null) => void;
  setDefaultTime: (time: Time | null) => void;
  setDefaultTask: (task: TaskFromStore | null) => void;
}

export const useNewTaskFormDefaultValuesStore =
  create<NewTaskFormDefaultValuesStore>((set) => ({
    defaultDay: null,
    defaultTime: null,
    defaultTask: null,
    setDefaultDay(day) {
      set({ defaultDay: day });
    },
    setDefaultTime(time) {
      set({ defaultTime: time });
    },
    setDefaultTask(task) {
      set({ defaultTask: task });
    },
  }));
