"use client";

import { Button } from "./ui/button";
import { ClipboardList } from "lucide-react";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { useShouldOpenNewTaskFormStore } from "@/lib/stores/shouldOpenNewTaskFormStore";
import { useNewTaskFormDefaultValuesStore } from "@/lib/stores/newTaskFormDefaultValuesStore";
import NewTaskFormDialogContent from "./NewTaskFormDialogContent";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function AddNewTaskButton(props: React.ComponentProps<typeof Button>) {
  const { shouldOpenNewTaskForm, openNewTaskForm, closeNewTaskForm } =
    useShouldOpenNewTaskFormStore();
  const { setDefaultDay, setDefaultTime, setDefaultTask } =
    useNewTaskFormDefaultValuesStore();

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

      <NewTaskFormDialogContent />
    </Dialog>
  );
}
