"use server";

import { Time } from "@/lib/classes/Time";
import { days } from "@/lib/constants";
import { createTask } from "@/lib/db/task";
import { newTaskSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function addNewTask(
  _prevState: unknown,
  values: z.infer<typeof newTaskSchema>,
) {
  const validated = newTaskSchema.safeParse(values);

  if (!validated.success) {
    return {
      error: "Some fields are invalid!",
    };
  }

  const { task, day, time, priority, description } = validated.data;

  try {
    await createTask({
      name: task,
      day: days.indexOf(day),
      time: Time.fromString(time)!,
      priority,
      description,
    });
  } catch {
    return {
      error: "Something went wrong! Please try again.",
    };
  }

  revalidatePath("/");

  return {
    success: "Added a task successfully!",
  };
}
