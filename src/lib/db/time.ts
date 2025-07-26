import { prisma } from "../prisma";
import { PrismaTimeModified } from "../ts/interfaces";

export async function getTimesByUserId(userId: string) {
  try {
    return (await prisma.time.findMany({
      where: { userId },
      orderBy: [
        {
          hour: "asc",
        },
        {
          minute: "asc",
        },
      ],
    })) as PrismaTimeModified[];
  } catch {
    return null;
  }
}
