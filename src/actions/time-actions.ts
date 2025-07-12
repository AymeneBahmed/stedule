"use server";

import { getSession } from "@/lib/auth/auth";
import { Time } from "@/lib/classes/Time";
import { prisma } from "@/lib/prisma";
import { newTimeSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function addNewTime(
  _prevState: unknown,
  values: z.infer<typeof newTimeSchema>,
) {
  const session = await getSession({ redirectOnNull: true });
  const validated = newTimeSchema.safeParse(values);

  if (!validated.success) {
    return {
      error: "Invalid time!",
    };
  }

  const { time } = validated.data;

  try {
    const existingTime = await prisma.time.findFirst({
      where: Time.fromString(time)!,
    });

    if (existingTime) {
      return {
        error: "Time already exists!",
      };
    }

    await prisma.time.create({
      data: {
        userId: session.user.id,
        ...Time.fromString(time)!,
      },
    });
  } catch {
    return {
      error: "Something went wrong! Please try again.",
    };
  }

  revalidatePath("/");

  return {
    success: "Added time successfully!",
  };
}

export async function removeTime(_prevState: unknown, id: number) {
  await getSession({ redirectOnNull: true });

  let time: Time;

  try {
    time = (await prisma.time.delete({
      where: { id },
    })) as Time;
  } catch {
    return {
      error: "Something went wrong! Please try again.",
    };
  }

  revalidatePath("/");

  return {
    success: `Removed time ${Time.toString(time.hour, time.minute)} successfully!`,
  };
}
