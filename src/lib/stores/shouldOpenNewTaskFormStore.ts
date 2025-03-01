import { create } from "zustand";

interface ShouldOpenNewTaskFormStore {
  shouldOpenNewTaskForm: boolean;
  openNewTaskForm: () => void;
  closeNewTaskForm: () => void;
}

export const useShouldOpenNewTaskFormStore = create<ShouldOpenNewTaskFormStore>(
  (set) => ({
    shouldOpenNewTaskForm: false,
    openNewTaskForm() {
      set({ shouldOpenNewTaskForm: true });
    },
    closeNewTaskForm() {
      set({ shouldOpenNewTaskForm: false });
    },
  }),
);
