import { create } from "zustand";
import { Time } from "../classes/Time";
import { Day } from "../ts/enums";
import { days } from "../constants";
import { PrismaTaskModified } from "../ts/interfaces";
import { dexieDB } from "../db/dexieDB";

export type TaskFromStore =
  | PrismaTaskModified
  | Omit<PrismaTaskModified, "userId" | "time">;

export interface TasksStore {
  tasks: TaskFromStore[];
  addTasks: (newTasks: TaskFromStore[]) => void;
  findTaskByDayAndTime: (
    day: Day | (typeof days)[number],
    time: Time,
  ) => Promise<TaskFromStore | null>;
  updateExistingTask: (
    day: Day | (typeof days)[number],
    time: Time,
    newDetails: Partial<TaskFromStore>,
  ) => void;
  deleteTasks: (taskIDs: number[]) => void;
}

export function isPrismaTask(task: TaskFromStore): task is PrismaTaskModified {
  return "time" in task;
}
/**
 * This store saves tasks so we don't have to fetch data multiple times from the server
 */
export const useTasksStore = create<TasksStore>((set, get) => ({
  tasks: [],
  addTasks(newTasks) {
    const tasksToAdd: TaskFromStore[] = [];
    const existingTasks = get().tasks;

    for (const task of newTasks) {
      if (!existingTasks.find(({ id }) => id === task.id)) {
        tasksToAdd.push(task);
      }
    }

    set((state) => {
      return { tasks: [...state.tasks, ...tasksToAdd] };
    });
  },
  async findTaskByDayAndTime(day, time) {
    const tasks = get().tasks;

    for (const task of tasks) {
      if (isPrismaTask(task)) {
        if (
          (typeof day === "string"
            ? days[task.day] === day
            : task.day === day) &&
          Time.equals(task.time, time)
        ) {
          return task;
        }

        continue;
      }

      const existingDexieTime = await dexieDB.times.get(task.timeId);

      if (!existingDexieTime) {
        throw new Error(`Time ID ${task.timeId} does not exist in times table`);
      }

      if (
        (typeof day === "string" ? days[task.day] === day : task.day === day) &&
        Time.equals(existingDexieTime, time)
      ) {
        return task;
      }
    }

    return null;
  },
  async updateExistingTask(day, time, newDetails) {
    const existingTasks = get().tasks;

    for (let i = 0; i < existingTasks.length; i++) {
      const task = existingTasks[i]!;
      let areTimesEqual: boolean;

      if (!isPrismaTask(task)) {
        const existingTime = await dexieDB.times.get(task.timeId);

        if (!existingTime) {
          throw new Error(
            `Time ID ${task.timeId} does not exist in times table`,
          );
        }

        areTimesEqual = Time.equals(existingTime, time);
      } else {
        areTimesEqual = Time.equals(task.time, time);
      }

      if (
        (typeof day === "string" ? days[task.day] === day : task.day === day) &&
        areTimesEqual
      ) {
        existingTasks[i] = { ...task, ...newDetails };
      }
    }

    set(() => ({ tasks: existingTasks }));
  },
  deleteTasks(taskIDs) {
    const existingTasks = get().tasks;
    const newTasksArray = [];

    for (const task of existingTasks) {
      if (!taskIDs.includes(task.id)) {
        newTasksArray.push(task);
      }
    }

    set({ tasks: newTasksArray });
  },
}));
