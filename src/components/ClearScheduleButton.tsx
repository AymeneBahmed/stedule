"use client";

import { RefreshCcw } from "lucide-react";
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
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { useIsGuestMode } from "@/hooks/use-is-guest-mode";
import { dexieDB } from "@/lib/db/dexieDB";

function ClearScheduleButton({
  ...props
}: React.ComponentProps<typeof Button>) {
  const [state, clearScheduleAction] = useActionState(clearSchedule, null);
  const isGuestMode = useIsGuestMode();

  function handleSubmit(e: React.MouseEvent<HTMLFormElement>) {
    e.preventDefault();

    startTransition(async () => {
      if (isGuestMode) {
        try {
          await Promise.all([dexieDB.tasks.clear(), dexieDB.times.clear()]);
        } catch {
          toast.error("Couldn't clear the schedule! Please try again.");
        }
      } else {
        clearScheduleAction();
      }
    });
  }

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
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
          <form onClick={handleSubmit}>
            <AlertDialogAction type="submit" asChild>
              <Button
                variant="destructive"
                className="bg-destructive text-white"
              >
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
