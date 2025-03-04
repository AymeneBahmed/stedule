"use server";

import { prisma } from "@/lib/prisma";
import { Time } from "@prisma/client";

export async function getTimes(): Promise<Time[]> {
  return await prisma.time.findMany();
}
