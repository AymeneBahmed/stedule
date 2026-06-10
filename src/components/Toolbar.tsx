"use client";

import AddNewTaskButton from "./AddNewTaskButton";
import AddNewTimeButton from "./AddNewTimeButton";
import ClearScheduleButton from "./ClearScheduleButton";
import PrintScheduleButton from "./PrintScheduleButton";
import ThemeTogglerButton from "./ThemeTogglerButton";

export default function Toolbar() {
  return (
    <span
      id="toolbar"
      className="bg-primary/15 sticky top-10 z-[1] flex space-x-2 rounded-full px-1.5 py-1 backdrop-blur-xl"
    >
      <AddNewTimeButton aria-label="Add a new time" />
      <AddNewTaskButton aria-label="Add a new task" />
      <ThemeTogglerButton className="rounded-full" aria-label="Toggle theme" />
      <PrintScheduleButton
        className="rounded-full"
        aria-label="Print schedule"
      />
      <ClearScheduleButton
        variant="destructive"
        className="!bg-destructive rounded-full"
        aria-label="Clear schedule"
      />
    </span>
  );
}
