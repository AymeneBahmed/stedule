import { Task } from "../classes/Task";
import { prisma } from "../prisma";
import { PrismaTaskModified } from "../ts/interfaces";

export async function getTasks() {
  try {
    return (await prisma.task.findMany()) as PrismaTaskModified[];
  } catch {
    return null;
  }
}

export async function createTask(task: Omit<Task, "id">) {
  try {
    return (await prisma.task.create({
      data: {
        name: task.name,
        day: task.day,
        time: Object(task.time),
        priority: task.priority,
        description: task.description,
      },
    })) as PrismaTaskModified;
  } catch {
    return null;
  }
}
