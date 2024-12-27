import { create } from "zustand";
import { Task } from "../classes/Task";
import { Day } from "../ts/enums";
import { Time } from "../classes/Time";

interface TasksStore {
  tasks: Task[];
  addTask: (task: Task) => void;
}

export const useTasksStore = create<TasksStore>((set) => ({
  // prettier-ignore
  tasks: [
    new Task("Read a book", Day.Sunday, new Time(3, 10), "low", "Study as hard as you can"),
    new Task("Read a book", Day.Tuesday, new Time(12, 40), "low", "Study as hard as you can"),
    new Task("Read a book", Day.Saturday, new Time(16, 45), "medium", "Study as hard as you can"),
    new Task("Read a book", Day.Monday, new Time(3, 8), "high", "Study as hard as you can"),
    new Task("Read a book", Day.Friday, new Time(7, 20), "low", "Study as hard as you can"),
    new Task("Read a book", Day.Wednesday, new Time(11, 30), "medium", "Study as hard as you can"),
    new Task("Read a book", Day.Sunday, new Time(15, 40), "low", "Study as hard as you can"),
    new Task("Read a book", Day.Wednesday, new Time(9, 45), "low", "Study as hard as you can"),
    new Task("Read a book", Day.Thursday, new Time(12, 40), "low", "Study as hard as you can"),
    new Task("Read a book", Day.Monday, new Time(12, 40), "low", "Study as hard as you can"),
  ],
  addTask(task) {
    set((state) => ({ tasks: [...state.tasks, task] }));
  },
}));
