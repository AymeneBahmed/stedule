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
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function AddNewTimeButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" className="rounded-full" {...props}>
              <Clock className="scale-125" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add Time</TooltipContent>
        </Tooltip>
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
