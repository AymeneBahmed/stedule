"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function clearSchedule() {
  try {
    await Promise.all([prisma.task.deleteMany(), prisma.time.deleteMany()]);
  } catch {
    return {
      error: "Couldn't clear the schedule! Please try again.",
    };
  }

  redirect("/");
}
