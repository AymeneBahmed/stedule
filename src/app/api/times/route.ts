import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    return Response.json(await prisma.time.findMany(), { status: 200 });
  } catch {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
