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

export default function NewTaskForm() {
  const form = useForm<z.infer<typeof newTaskSchema>>({
    resolver: zodResolver(newTaskSchema),
    defaultValues: {
      task: "",
      priority: "unspecified",
      description: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="mt-5">
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
                    {["unspecified", "low", "medium", "high"].map((pri) => (
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

        <Button className="mt-10 w-full">Submit</Button>
      </form>
    </Form>
  );
}
