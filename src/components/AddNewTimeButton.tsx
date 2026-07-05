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
import { NewTimeForm } from "./NewTimeForm";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function AddNewTimeButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button size="icon" className="rounded-full" {...props}>
              <Clock className="scale-125" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Add Time</TooltipContent>
      </Tooltip>

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
