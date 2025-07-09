"use client";

import { RefreshCcw, TriangleAlert } from "lucide-react";
import { Button } from "./ui/button";
import { clearSchedule } from "@/actions/clear-schedule-actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

function ClearScheduleButton({
  ...props
}: React.ComponentProps<typeof Button>) {
  const [state, clearScheduleAction] = useActionState(clearSchedule, null);

  useEffect(() => {
    if (state?.error) {
      toast(state?.error, { icon: <TriangleAlert /> });
    }
  }, [state?.error]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" {...props}>
          <RefreshCcw />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear the schedule?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently reset your
            current schedule.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={clearScheduleAction}>
            <AlertDialogAction type="submit" asChild>
              <Button variant="destructive" className="text-white">
                Clear
              </Button>
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ClearScheduleButton;
