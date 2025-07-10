"use client";

import { useShouldOpenNewTaskFormStore } from "@/lib/stores/shouldOpenNewTaskFormStore";
import AddNewTaskButton from "./AddNewTaskButton";
import AddNewTimeButton from "./AddNewTimeButton";
import ClearScheduleButton from "./ClearScheduleButton";
import PrintScheduleButton from "./PrintScheduleButton";
import ThemeTogglerButton from "./ThemeTogglerButton";
import { cn } from "@/lib/utils";

export default function Toolbar() {
  const { shouldOpenNewTaskForm } = useShouldOpenNewTaskFormStore();

  return (
    <span
      className={cn(
        "bg-primary/15 sticky top-10 flex space-x-2 rounded-full px-1.5 py-1 backdrop-blur-xl",
        !shouldOpenNewTaskForm && "z-[9999999]",
      )}
    >
      <AddNewTimeButton />
      <AddNewTaskButton />
      <ThemeTogglerButton className="rounded-full" />
      <PrintScheduleButton className="rounded-full" />
      <ClearScheduleButton
        variant="destructive"
        className="!bg-destructive rounded-full"
      />
    </span>
  );
}
