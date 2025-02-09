"use client";

import { newTaskSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { startTransition, useActionState } from "react";
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
import { useNewTaskFormDefaultValuesStore } from "@/lib/stores/newTaskFormDefaultValues";
import { useShouldOpenNewTaskFormStore } from "@/lib/stores/shouldOpenNewTaskForm";

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

  function onSubmit(values: z.infer<typeof newTaskSchema>) {
    startTransition(() => {
      addNewTaskAction(values);
      closeNewTaskForm();
    });
  }

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
                <FormControl className="!mt-1">
                  <Input
                    placeholder="e.g algorithms and data structures..."
                    className="border-gray-400 bg-secondary"
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
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border-gray-400 bg-secondary">
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
                    className="border-gray-400 bg-secondary"
                    {...field}
                  />
                </FormControl>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border-gray-400 bg-secondary">
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
                <FormControl className="!mt-1">
                  <Input
                    placeholder="Solve an exercise and write some code..."
                    className="border-gray-400 bg-secondary"
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
          Submit
        </Button>
      </form>
    </Form>
  );
}
