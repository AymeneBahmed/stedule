import { create } from "zustand";

interface ShouldOpenNewTimeFormStore {
  shouldOpenNewTimeForm: boolean;
  openNewTimeForm: () => void;
  closeNewTimeForm: () => void;
}

export const useShouldOpenNewTimeFormStore = create<ShouldOpenNewTimeFormStore>(
  (set) => ({
    shouldOpenNewTimeForm: false,
    openNewTimeForm() {
      set({ shouldOpenNewTimeForm: true });
    },
    closeNewTimeForm() {
      set({ shouldOpenNewTimeForm: false });
    },
  }),
);
