import ScheduleTable from "@/components/ScheduleTable";
import { Task } from "@/lib/classes/Task";
import { getTasks } from "@/lib/db/task";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const initialTasks = ((await getTasks()) ?? []).map<Task>((task) => ({
    ...task,
    description: task.description ?? undefined,
  }));

  // The second condition make sure to not insert multiple default times if they already exist.
  if (initialTasks.length === 0 && (await prisma.time.count()) === 0) {
    await prisma.time.createMany({
      data: Array.from({ length: 8 }, (_, i) => ({ hour: i + 8, minute: 0 })),
    });
  }

  return (
    <div className="flex min-h-full items-center justify-center [&>div]:w-[80%]">
      <ScheduleTable initialTasks={initialTasks} />
    </div>
  );
}
