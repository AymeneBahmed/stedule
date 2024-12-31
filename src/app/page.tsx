import ScheduleTable from "@/components/ScheduleTable";
import { Task } from "@/lib/classes/Task";
import { getTasks } from "@/lib/db/task";
import { Hour, Minute } from "@/lib/ts/types";

export default async function Home() {
  const tasks = ((await getTasks()) ?? []).map<Task>(
    ({ id, name, date, priority, description }) => ({
      id,
      name,
      priority,
      day: date.getDay(),
      time: {
        hour: date.getHours() as Hour,
        minute: date.getMinutes() as Minute,
      },
      description: description ?? undefined,
    }),
  );

  return (
    <div className="flex min-h-full items-center justify-center [&>div]:w-[80%]">
      <ScheduleTable tasks={tasks} />
    </div>
  );
}
