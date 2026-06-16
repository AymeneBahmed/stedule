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

export function AddNewTimeButton(
  props: React.ComponentProps<typeof Button>,
) {
  return (
    <Dialog>
      <DialogTrigger asChild>
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
