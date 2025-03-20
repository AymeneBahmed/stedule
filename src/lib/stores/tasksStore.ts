import { create } from "zustand";
import { Task } from "../classes/Task";

interface TasksStore {
  tasks: Task[];
  addTasks: (newTasks: Task[]) => void;
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
}));
