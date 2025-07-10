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
import NewTaskForm from "./NewTaskForm";
import { useNewTaskFormDefaultValuesStore } from "@/lib/stores/newTaskFormDefaultValuesStore";

export default function AddNewTaskButton(
  props: React.ComponentProps<typeof Button>,
) {
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

          setTimeout(() => {
            setDefaultDay(null);
            setDefaultTime(null);
            setDefaultTask(null);
          }, 100);
        }
      }}
    >
      <DialogTrigger asChild onClick={openNewTaskForm}>
        <Button size="icon" className="rounded-full" {...props}>
          <ClipboardList className="scale-125" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>What do you want to do?</DialogTitle>
          <DialogDescription className="sr-only">
            Add new time
          </DialogDescription>
        </DialogHeader>

        <NewTaskForm />
      </DialogContent>
    </Dialog>
  );
}
