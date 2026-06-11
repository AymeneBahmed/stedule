"use client";

import { newTaskSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { startTransition, useActionState, useEffect, useState } from "react";
import { addNewTask } from "@/actions/task-actions";
import FormError from "./FormError";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { days, priorities } from "@/lib/constants";
import { useNewTaskFormDefaultValuesStore } from "@/lib/stores/newTaskFormDefaultValuesStore";
import { useShouldOpenNewTaskFormStore } from "@/lib/stores/shouldOpenNewTaskFormStore";
import { TaskFromStore, useTasksStore } from "@/lib/stores/tasksStore";
import { Time } from "@/lib/classes/Time";
import { useEditTaskModeStore } from "@/lib/stores/editTaskModeStore";
import { toast } from "sonner";
import { useIsGuestMode } from "@/hooks/use-is-guest-mode";
import { dexieDB } from "@/lib/db/dexieDB";

export default function NewTaskForm() {
  const { defaultDay, defaultTime, defaultTask } =
    useNewTaskFormDefaultValuesStore();
  const form = useForm<z.infer<typeof newTaskSchema>>({
    resolver: zodResolver(newTaskSchema),
    defaultValues: {
      task: defaultTask?.name ?? "",
      day: defaultDay ?? undefined,
      time:
        defaultTime == null
          ? ""
          : `${defaultTime.hour.toString().padStart(2, "0")}:${defaultTime.minute.toString().padStart(2, "0")}`,
      priority: defaultTask?.priority ?? "Unspecified",
      description: defaultTask?.description ?? "",
    },
  });
  const [state, addNewTaskAction, isPending] = useActionState(addNewTask, null);
  const { closeNewTaskForm } = useShouldOpenNewTaskFormStore();
  const {
    findTaskByDayAndTime,
    updateExistingTask: updateExistingTaskInStore,
    addTasks: addTasksToStore,
  } = useTasksStore();
  const { editTaskModeEnabled, enableEditTaskMode, disableEditTaskMode } =
    useEditTaskModeStore();
  const [oldTask, setOldTask] = useState<TaskFromStore | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const isGuestMode = useIsGuestMode();
  const [guestModeError, setGuestModeError] = useState<string>();
  const day = form.watch("day");
  const timeString = form.watch("time");

  function onSubmit(values: z.infer<typeof newTaskSchema>) {
    startTransition(async () => {
      if (isGuestMode) {
        try {
          const chosenTime = Time.fromString(values.time)!;
          const existingTime = await dexieDB.times
            .where({
              hour: chosenTime.hour,
              minute: chosenTime.minute,
            })
            .first();
          let timeId = existingTime?.id;

          if (timeId == null) {
            timeId = await dexieDB.times.add(chosenTime);
          }

          const existingTask = await dexieDB.tasks
            .where({ day: days.indexOf(values.day), timeId })
            .first();

          if (existingTask != null) {
            await dexieDB.tasks.update(existingTask.id, {
              name: values.task,
              description: values.description,
              priority: values.priority,
            });

            updateExistingTaskInStore(
              values.day,
              Time.fromString(values.time)!,
              {
                name: values.task,
                description: values.description,
                priority: values.priority,
              },
            );

            toast.success("Updated task successfully!");
          } else {
            await dexieDB.tasks.add({
              name: values.task,
              day: days.indexOf(values.day),
              priority: values.priority,
              description: values.description ?? null,
              timeId,
            });

            // Don't use addTasksToStore here because useLiveQuery listens to changes and re-renders.
            toast.success("Added a task successfully!");
          }

          closeNewTaskForm();
        } catch {
          setGuestModeError("Something went wrong! Please try again.");
        }
      } else {
        addNewTaskAction(values);
      }

      setSubmitted(true);
    });
  }

  async function getExistingTask() {
    // I don't know why the day and timeString variables (The ones above outside of this functino) are not working.
    const day = form.getValues("day");
    const timeString = form.getValues("time");
    const time = Time.fromString(timeString);

    if (time == null) {
      return;
    }

    const existingTask = await findTaskByDayAndTime(day, time);

    if (existingTask) {
      setOldTask(existingTask);
      enableEditTaskMode();
    } else {
      disableEditTaskMode();
    }
  }

  useEffect(() => {
    const time = Time.fromString(timeString);

    if (time == null) {
      return;
    }

    (async () => {
      setOldTask(await findTaskByDayAndTime(day, time));
    })();
  }, [day, findTaskByDayAndTime, form, timeString]);

  useEffect(() => {
    if (submitted && state?.success) {
      if (editTaskModeEnabled) {
        updateExistingTaskInStore(state.task.day, state.task.time, state.task);
      } else {
        addTasksToStore([state.task]);
      }

      closeNewTaskForm();
      toast.success(state.success);
    }
  }, [
    addTasksToStore,
    closeNewTaskForm,
    editTaskModeEnabled,
    state?.success,
    state?.task,
    submitted,
    updateExistingTaskInStore,
  ]);

  useEffect(() => {
    if (defaultTask != null) {
      enableEditTaskMode();
    } else {
      disableEditTaskMode();
    }
  }, [defaultTask, disableEditTaskMode, enableEditTaskMode]);

  return (
    <Form {...form}>
      {editTaskModeEnabled && oldTask && (
        <div className="text-muted-foreground mt-7 mb-3">
          <div>Old task&apos;s details:</div>
          <ol className="list-disc *:ml-7" role="list">
            <li>
              name: <strong>{oldTask!.name}</strong>
            </li>
            <li>
              priority: <strong>{oldTask!.priority}</strong>
            </li>
            {oldTask?.description && (
              <li>
                description: <strong>{oldTask.description}</strong>
              </li>
            )}
          </ol>
        </div>
      )}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-5"
        id="new-task-form"
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="task"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task</FormLabel>
                <FormControl className="mt-1!">
                  <Input
                    placeholder="e.g algorithms and data structures..."
                    className="bg-secondary border-gray-400"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="day"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Day</FormLabel>
                <Select
                  onValueChange={async (value) => {
                    field.onChange(value);

                    if (
                      form.getValues("time").length === 5 &&
                      !form.getFieldState("time").invalid
                    ) {
                      await getExistingTask();
                    }
                  }}
                  defaultValue={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger className="bg-secondary border-gray-400">
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent id="day-selector">
                    {days.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input
                    placeholder="hh:mm"
                    className="bg-secondary border-gray-400"
                    {...field}
                    onInput={async (e) => {
                      const value = e.currentTarget.value.replace(
                        /[^0-9]/g,
                        "",
                      );
                      let newValue = "";

                      // Automatically insert colon after 2 digits
                      if (value.length > 2) {
                        newValue =
                          value.substring(0, 2) + ":" + value.substring(2, 4);
                      } else {
                        newValue = value;
                      }

                      // Move cursor to correct position
                      e.currentTarget.value = newValue;

                      if (newValue.length === 2 && value.length > 2) {
                        e.currentTarget.setSelectionRange(3, 3);
                      } else if (newValue.length === 2) {
                        e.currentTarget.setSelectionRange(2, 2);
                      } else if (
                        newValue.length === 3 &&
                        !newValue.includes(":")
                      ) {
                        e.currentTarget.value =
                          newValue.substring(0, 2) +
                          ":" +
                          newValue.substring(2);
                        e.currentTarget.setSelectionRange(3, 3);
                      }

                      if (
                        e.currentTarget.value.length === 5 &&
                        Time.fromString(e.currentTarget.value) != null
                      ) {
                        await getExistingTask();
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>
                  The colon (:) is automatically inserted.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Priority <em className="text-muted-foreground">(Optional)</em>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl className="w-full">
                    <SelectTrigger className="bg-secondary border-gray-400">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent id="priority-selector">
                    {priorities.map((pri) => (
                      <SelectItem key={pri} value={pri}>
                        {pri}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description{" "}
                  <em className="text-muted-foreground">(Optional)</em>
                </FormLabel>
                <FormControl className="mt-1!">
                  <Input
                    placeholder="Solve an exercise and write some code..."
                    className="bg-secondary border-gray-400"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {(state?.error || guestModeError) && (
          <FormError message={state?.error || guestModeError || ""} />
        )}

        <Button disabled={isPending} className="mt-10 w-full">
          {editTaskModeEnabled ? "Edit" : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
