"use client";

import { Button } from "./ui/button";
import { ClipboardList } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useShouldOpenNewTaskFormStore } from "@/lib/stores/shouldOpenNewTaskFormStore";
import { useNewTaskFormDefaultValuesStore } from "@/lib/stores/newTaskFormDefaultValuesStore";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useEditTaskModeStore } from "@/lib/stores/editTaskModeStore";
import { Badge } from "./ui/badge";
import { NewTaskForm } from "./NewTaskForm";
import { cn } from "@/lib/utils";

export function AddNewTaskButton(props: React.ComponentProps<typeof Button>) {
  const { shouldOpenNewTaskForm, openNewTaskForm, closeNewTaskForm } =
    useShouldOpenNewTaskFormStore();
  const { setDefaultDay, setDefaultTime, setDefaultTask } =
    useNewTaskFormDefaultValuesStore();
  const { editTaskModeEnabled } = useEditTaskModeStore();

  return (
    <Dialog
      open={shouldOpenNewTaskForm}
      onOpenChange={(open) => {
        if (open) {
          setDefaultDay(null);
          setDefaultTime(null);
          setDefaultTask(null);

          openNewTaskForm();
        } else {
          closeNewTaskForm();

          // This prevents NewTaskForm from layout shifting
          setTimeout(() => {
            setDefaultDay(null);
            setDefaultTime(null);
            setDefaultTask(null);
          }, 100);
        }
      }}
    >
      <DialogTrigger asChild onClick={openNewTaskForm}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" className="rounded-full" {...props}>
              <ClipboardList className="scale-125" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add Task</TooltipContent>
        </Tooltip>
      </DialogTrigger>

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
    </Dialog>
  );
}
