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
import { Badge } from "./ui/badge";

export default function NewTaskFormDialogContent() {
  const { editTaskModeEnabled } = useEditTaskModeStore();

  return (
    <DialogContent className="gap-0">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          What do you want to do?{" "}
          <Badge className={cn(!editTaskModeEnabled && "invisible")}>
            Edit Mode
          </Badge>
        </DialogTitle>
        <DialogDescription className="sr-only">
          Create a task and add an optional description such as notes.
        </DialogDescription>
      </DialogHeader>

      <NewTaskForm />
    </DialogContent>
  );
}
