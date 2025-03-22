import { create } from "zustand";
import { Task } from "../classes/Task";
import { Time } from "../classes/Time";
import { Day } from "../ts/enums";
import { days } from "../constants";

interface TasksStore {
  tasks: Task[];
  addTasks: (newTasks: Task[]) => void;
  findTaskByDayAndTime: (
    day: Day | (typeof days)[number],
    time: Time,
  ) => Task | null;
}

export const useTasksStore = create<TasksStore>((set, get) => ({
  tasks: [],
  addTasks(newTasks) {
    const tasksToAdd: Task[] = [];

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
}));
