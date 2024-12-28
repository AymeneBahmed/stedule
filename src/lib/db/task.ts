import { prisma } from "../prisma";

export async function getTasks() {
  try {
    return await prisma.task.findMany();
  } catch {
    return null;
  }
}
