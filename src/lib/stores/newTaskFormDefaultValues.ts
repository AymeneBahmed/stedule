import { create } from "zustand";
import { days } from "../constants";
import { Time } from "../classes/Time";
import { Task } from "../classes/Task";

interface NewTaskFormDefaultValues {
  defaultDay: (typeof days)[number] | null;
  defaultTime: Time | null;
  // Used if clicked on an occupied cell in the schedule table
  defaultTask: Task | null;
  setDefaultDay: (day: (typeof days)[number] | null) => void;
  setDefaultTime: (time: Time | null) => void;
  setDefaultTask: (task: Task | null) => void;
}

export const useNewTaskFormDefaultValuesStore =
  create<NewTaskFormDefaultValues>((set) => ({
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
