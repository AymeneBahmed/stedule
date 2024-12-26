"use server";

import { newTaskSchema } from "@/lib/schemas";
import { z } from "zod";

export async function addNewTask(
  _prevState: unknown,
  values: z.infer<typeof newTaskSchema>,
) {
  return {
    error: "Something went wrong! Please try again.",
  };
}
