import { create } from "zustand";
import { Time } from "../classes/Time";
import { Day } from "../ts/enums";
import { days } from "../constants";
import { PrismaTaskModified } from "../ts/interfaces";

interface TasksStore {
  tasks: PrismaTaskModified[];
  addTasks: (newTasks: PrismaTaskModified[]) => void;
  findTaskByDayAndTime: (
    day: Day | (typeof days)[number],
    time: Time,
  ) => PrismaTaskModified | null;
  updateExistingTask: (
    day: Day | (typeof days)[number],
    time: Time,
    newDetails: Partial<PrismaTaskModified>,
  ) => void;
}

export const useTasksStore = create<TasksStore>((set, get) => ({
  tasks: [],
  addTasks(newTasks) {
    const tasksToAdd: PrismaTaskModified[] = [];

    for (const task of newTasks) {
      if (!get().tasks.includes(task)) {
        tasksToAdd.push(task);
      }
    }

    set((state) => ({ tasks: [...state.tasks, ...tasksToAdd] }));
  },
  findTaskByDayAndTime(day, time) {
    return (
      get().tasks.find(
        (task) =>
          (typeof day === "string"
            ? days[task.day] === day
            : task.day === day) && Time.equals(task.time, time),
      ) ?? null
    );
  },
  updateExistingTask(day, time, newDetails) {
    const existingTasks = get().tasks;

    for (let i = 0; i < get().tasks.length; i++) {
      const task = existingTasks[i]!;

      if (
        (typeof day === "string" ? days[task.day] === day : task.day === day) &&
        Time.equals(task.time, time)
      ) {
        existingTasks[i] = { ...task, ...newDetails };
      }
    }

    set((state) => ({ tasks: state.tasks }));
  },
}));
