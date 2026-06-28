import { removeTask } from "@/actions/task-actions";
import { removeTime } from "@/actions/time-actions";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export function useScheduleActions() {
  const [removeTimeActionState, removeTimeAction, removeTimeActionPending] =
    useActionState(removeTime, null);
  const [removeTaskActionState, removeTaskAction, removeTaskActionPending] =
    useActionState(removeTask, null);

  // Show time deletion state notification
  // prettier-ignore
  useEffect(() => {
    if (removeTimeActionState?.error) toast.error(removeTimeActionState.error);
    if (removeTimeActionState?.success) toast.success(removeTimeActionState.success);
  }, [removeTimeActionState]);

  // Show task deletion state notification
  // prettier-ignore
  useEffect(() => {
    if (removeTaskActionState?.error) toast.error(removeTaskActionState.error);
    if (removeTaskActionState?.success) toast.success(removeTaskActionState.success);
  }, [removeTaskActionState]);

  return {
    removeTimeAction,
    removeTimeActionPending,
    removeTaskAction,
    removeTaskActionPending,
  };
}
