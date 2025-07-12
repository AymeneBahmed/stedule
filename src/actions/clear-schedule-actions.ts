"use server";

import { getSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function clearSchedule() {
  await getSession({ redirectOnNull: true });

  try {
    await prisma.time.deleteMany();
  } catch {
    return {
      error: "Couldn't clear the schedule! Please try again.",
    };
  }

  redirect("/");
}
