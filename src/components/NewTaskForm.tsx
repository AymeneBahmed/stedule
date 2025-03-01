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
import { startTransition, useActionState, useEffect } from "react";
import { addNewTask } from "@/actions/new-task-form";
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
import { useTasksStore } from "@/lib/stores/tasksStore";
import { Time } from "@/lib/classes/Time";
import { useEditTaskModeStore } from "@/lib/stores/editTaskModeStore";

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
          ? undefined
          : `${defaultTime.hour.toString().padStart(2, "0")}:${defaultTime.minute.toString().padStart(2, "0")}`,
      priority: defaultTask?.priority ?? "Unspecified",
      description: defaultTask?.description ?? "",
    },
  });
  const [state, addNewTaskAction, isPending] = useActionState(addNewTask, null);
  const { closeNewTaskForm } = useShouldOpenNewTaskFormStore();
  const { tasks } = useTasksStore();
  const { editTaskModeEnabled, enableEditTaskMode, disableEditTaskMode } =
    useEditTaskModeStore();

  function onSubmit(values: z.infer<typeof newTaskSchema>) {
    startTransition(() => {
      addNewTaskAction(values);
      closeNewTaskForm();
    });
  }

  function getExistingTask() {
    const formValues = form.getValues();
    const existingTask = tasks.find(
      (task) =>
        days[task.day] === formValues.day &&
        Time.equals(task.time, Time.fromString(formValues.time)!),
    );

    if (existingTask) {
      enableEditTaskMode();
      form.setValue("task", existingTask.name);
      form.setValue("day", days[existingTask.day]);
      form.setValue(
        "time",
        `${existingTask.time.hour < 10 ? "0" : ""}${existingTask.time.hour}:${existingTask.time.minute < 10 ? "0" : ""}${existingTask.time.minute}`,
      );
      form.setValue("priority", existingTask.priority);
      form.setValue("description", existingTask.description);
    } else {
      disableEditTaskMode();
      form.setValue("task", "");
      form.setValue("description", "");
    }
  }

  useEffect(() => {
    if (defaultTask != null) {
      enableEditTaskMode();
    } else {
      disableEditTaskMode();
    }
  }, [defaultTask, disableEditTaskMode, enableEditTaskMode]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5">
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
                  onValueChange={(value) => {
                    field.onChange(value);

                    getExistingTask();
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-secondary border-gray-400">
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
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
                    onInput={(e) => {
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
                        getExistingTask();
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
                  <FormControl>
                    <SelectTrigger className="bg-secondary border-gray-400">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
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

        {typeof state?.error === "string" && (
          <FormError message={state.error} />
        )}

        <Button disabled={isPending} className="mt-10 w-full">
          {editTaskModeEnabled ? "Edit" : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
