import { create } from "zustand";

interface EditTaskModeStore {
  editTaskModeEnabled: boolean;
  enableEditTaskMode: () => void;
  disableEditTaskMode: () => void;
}

export const useEditTaskModeStore = create<EditTaskModeStore>((set) => ({
  editTaskModeEnabled: false,
  enableEditTaskMode() {
    set({ editTaskModeEnabled: true });
  },
  disableEditTaskMode() {
    set({ editTaskModeEnabled: false });
  },
}));
