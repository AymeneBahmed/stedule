"use client";

import { Button } from "./ui/button";
import { Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import NewTimeForm from "./NewTimeForm";
import { useShouldOpenNewTimeFormStore } from "@/lib/stores/shouldOpenNewTimeFormStore";

export default function AddNewTimeButton(
  props: React.ComponentProps<typeof Button>,
) {
  const { shouldOpenNewTimeForm, openNewTimeForm, closeNewTimeForm } =
    useShouldOpenNewTimeFormStore();

  return (
    <Dialog
      open={shouldOpenNewTimeForm}
      onOpenChange={(open) => {
        if (open) {
          openNewTimeForm();
        } else {
          closeNewTimeForm();
        }
      }}
    >
      <DialogTrigger asChild onClick={openNewTimeForm}>
        <Button size="icon" className="rounded-full" {...props}>
          <Clock className="scale-125" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add time</DialogTitle>
          <DialogDescription className="sr-only">
            Add new time
          </DialogDescription>
        </DialogHeader>

        <NewTimeForm />
      </DialogContent>
    </Dialog>
  );
}
