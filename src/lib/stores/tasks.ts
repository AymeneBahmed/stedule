import { create } from "zustand";
import { Task } from "../classes/Task";

interface TasksStore {
  tasks: Task[];
  addTask: (task: Task) => void;
}

export const useTasksStore = create<TasksStore>((set) => ({
  tasks: [],
  addTask(task) {
    set((state) => ({ tasks: [...state.tasks, task] }));
  },
}));
