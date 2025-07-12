"use server";

import { getSession } from "@/lib/auth/auth";
import { Time } from "@/lib/classes/Time";
import { days } from "@/lib/constants";
import { createTask } from "@/lib/db/task";
import { prisma } from "@/lib/prisma";
import { newTaskSchema } from "@/lib/schemas";
import { PrismaTaskModified } from "@/lib/ts/interfaces";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function addNewTask(
  _prevState: unknown,
  values: z.infer<typeof newTaskSchema>,
) {
  const session = await getSession({ redirectOnNull: true });
  const validated = newTaskSchema.safeParse(values);

  if (!validated.success) {
    return {
      error: "Some fields are invalid!",
    };
  }

  const { task: taskName, day, time, priority, description } = validated.data;
  let task: PrismaTaskModified | null = null;
  let isNewTask = false;

  try {
    const existingTask = await prisma.task.findFirst({
      where: {
        day: days.indexOf(day),
        time: Time.fromString(time)!,
      },
    });

    if (existingTask != null) {
      task = (await prisma.task.update({
        where: { id: existingTask.id },
        data: {
          name: taskName,
          priority,
          description,
        },
        include: {
          time: true,
        },
      })) as PrismaTaskModified;
    } else {
      isNewTask = true;
      task = await createTask({
        name: taskName,
        day: days.indexOf(day),
        time: Time.fromString(time)!,
        priority,
        description: description ?? null,
        userId: session.user.id,
      });
    }
  } catch {
    return {
      error: "Something went wrong! Please try again.",
    };
  }

  revalidatePath("/");

  return {
    success: isNewTask
      ? "Added a task successfully!"
      : "Updated task successfully!",
    task: task as PrismaTaskModified,
  };
}

export async function removeTask(_prevState: unknown, id: number) {
  try {
    await prisma.task.delete({
      where: { id },
    });
  } catch {
    return {
      error: "Something went wrong! Please try again.",
    };
  }

  revalidatePath("/");

  return {
    success: "Removed task successfully!",
  };
}
