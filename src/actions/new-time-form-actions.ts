"use server";

import { Time } from "@/lib/classes/Time";
import { prisma } from "@/lib/prisma";
import { newTimeSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function addNewTime(
  _prevState: unknown,
  values: z.infer<typeof newTimeSchema>,
) {
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
      data: Time.fromString(time)!,
    });
  } catch {
    return {
      error: "Something went wrong! Please try again.",
    };
  }

  revalidatePath("/");

  return {
    success: "Added a time successfully!",
  };
}
