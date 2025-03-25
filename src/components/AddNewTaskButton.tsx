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

export default function AddNewTaskButton(
  props: React.ComponentProps<typeof Button>,
) {
  const { shouldOpenNewTaskForm, openNewTaskForm, closeNewTaskForm } =
    useShouldOpenNewTaskFormStore();

  return (
    <Dialog
      open={shouldOpenNewTaskForm}
      onOpenChange={(open) => {
        if (open) {
          openNewTaskForm();
        } else {
          closeNewTaskForm();
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
