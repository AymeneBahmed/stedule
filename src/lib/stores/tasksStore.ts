import { create } from "zustand";
import { Time } from "../classes/Time";
import { Day } from "../ts/enums";
import { days } from "../constants";
import { PrismaTaskModified } from "../ts/interfaces";
import { dexieDB } from "../db/dexieDB";

export type TaskFromStore =
  | PrismaTaskModified
  | Omit<PrismaTaskModified, "userId" | "time">;

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
  deleteTasks: (taskIDs: number[]) => void;
}

export function isPrismaTask(task: TaskFromStore): task is PrismaTaskModified {
  return "time" in task;
}

export const useTasksStore = create<TasksStore>((set, get) => ({
  tasks: [],
  addTasks(newTasks) {
    const tasksToAdd: TaskFromStore[] = [];
    const existingTasks = get().tasks;

    for (const task of newTasks) {
      if (existingTasks.find(({ id }) => id === task.id) == null) {
        tasksToAdd.push(task);
      }
    }

    set((state) => {
      return { tasks: [...state.tasks, ...tasksToAdd] };
    });
  },
  findTaskByDayAndTime(day, time) {
    return (
      get().tasks.find(async (task) => {
        if (isPrismaTask(task)) {
          return (
            (typeof day === "string"
              ? days[task.day] === day
              : task.day === day) && Time.equals(task.time, time)
          );
        } else {
          const existingTime = await dexieDB.times.get(task.timeId);

          if (existingTime == null) {
            throw new Error(
              `Time ID ${task.timeId} does not exist in times table`,
            );
          }

          return (
            (typeof day === "string"
              ? days[task.day] === day
              : task.day === day) && Time.equals(existingTime, time)
          );
        }
      }) ?? null
    );
  },
  async updateExistingTask(day, time, newDetails) {
    const existingTasks = get().tasks;

    for (let i = 0; i < existingTasks.length; i++) {
      const task = existingTasks[i]!;
      let areTimesEqual: boolean;

      if (!isPrismaTask(task)) {
        const existingTime = await dexieDB.times.get(task.timeId);

        if (existingTime == null) {
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
