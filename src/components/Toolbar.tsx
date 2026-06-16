"use client";

import { AddNewTaskButton } from "./AddNewTaskButton";
import { AddNewTimeButton } from "./AddNewTimeButton";
import { ClearScheduleButton } from "./ClearScheduleButton";
import { PrintScheduleButton } from "./PrintScheduleButton";
import { ThemeTogglerButton } from "./ThemeTogglerButton";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function Toolbar() {
  return (
    <span
      id="toolbar"
      className="bg-primary/15 dark:bg-primary/30 sticky top-10 z-[1] flex space-x-2 rounded-full px-1.5 py-1 backdrop-blur-xl"
    >
      <Tooltip>
        <TooltipTrigger>
          <AddNewTimeButton aria-label="Add a new time" />
        </TooltipTrigger>
        <TooltipContent>Add Time</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <AddNewTaskButton aria-label="Add a new task" />
        </TooltipTrigger>
        <TooltipContent>Add Task</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <ThemeTogglerButton
            className="rounded-full"
            aria-label="Toggle theme"
          />
        </TooltipTrigger>
        <TooltipContent>Change Theme</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <PrintScheduleButton
            className="rounded-full"
            aria-label="Print schedule"
          />
        </TooltipTrigger>
        <TooltipContent>Print Schedule</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <ClearScheduleButton
            variant="destructive"
            className="rounded-full"
            aria-label="Clear schedule"
          />
        </TooltipTrigger>
        <TooltipContent>Clear Schedule</TooltipContent>
      </Tooltip>
    </span>
  );
}
