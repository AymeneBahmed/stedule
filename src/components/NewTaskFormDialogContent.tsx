"use client";

import { cn } from "@/lib/utils";
import NewTaskForm from "./NewTaskForm";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useEditTaskModeStore } from "@/lib/stores/editTaskModeStore";

export default function NewTaskFormDialogContent() {
  const { editTaskModeEnabled } = useEditTaskModeStore();

  return (
    <DialogContent className="gap-0">
      <DialogHeader>
        <DialogTitle>
          What do you want to do?{" "}
          <span
            className={cn(
              "rounded bg-blue-700 px-2 py-0.5 text-sm text-white",
              !editTaskModeEnabled && "invisible",
            )}
          >
            Edit
          </span>
        </DialogTitle>
        <DialogDescription className="sr-only">
          Create a task and add an optional description such as notes.
        </DialogDescription>
      </DialogHeader>

      <NewTaskForm />
    </DialogContent>
  );
}
