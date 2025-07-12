import { create } from "zustand";
import { Time } from "../classes/Time";
import { Day } from "../ts/enums";
import { days } from "../constants";
import { PrismaTaskModified } from "../ts/interfaces";

export type TaskFromStore =
  | PrismaTaskModified
  | Omit<PrismaTaskModified, "userId">;

interface TasksStore {
  tasks: TaskFromStore[];
  addTasks: (newTasks: TaskFromStore[]) => void;
  findTaskByDayAndTime: (
    day: Day | (typeof days)[number],
    time: Time,
  ) => TaskFromStore | null;
  updateExistingTask: (
    day: Day | (typeof days)[number],
    time: Time,
    newDetails: Partial<TaskFromStore>,
  ) => void;
}

export const useTasksStore = create<TasksStore>((set, get) => ({
  tasks: [],
  addTasks(newTasks) {
    const tasksToAdd: TaskFromStore[] = [];

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
