import ScheduleTable from "@/components/ScheduleTable";
import Toolbar from "@/components/Toolbar";
import { Task } from "@/lib/classes/Task";
import { Time as TimeClass } from "@/lib/classes/Time";
import { getTasks } from "@/lib/db/task";
import { prisma } from "@/lib/prisma";
import { Time } from "@prisma/client";

export default async function Home() {
  const initialTasks = ((await getTasks()) ?? []).map<Task>((task) => ({
    ...task,
    description: task.description ?? undefined,
  }));
  const times = (await prisma.time.findMany()).toSorted((a, b) =>
    a.hour === b.hour ? a.minute - b.minute : a.hour - b.hour,
  ) as (TimeClass & Time)[];

  // The second condition make sure to not insert multiple default times if they already exist.
  if (initialTasks.length === 0 && times.length === 0) {
    await prisma.time.createMany({
      data: Array.from({ length: 8 }, (_, i) => ({ hour: i + 8, minute: 0 })),
    });
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-6 py-10 [&>div]:w-[80%]">
      <Toolbar />
      <ScheduleTable tasks={initialTasks} times={times} />
    </div>
  );
}
