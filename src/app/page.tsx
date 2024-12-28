import ScheduleTable from "@/components/ScheduleTable";
import { Task } from "@/lib/classes/Task";
import { Time } from "@/lib/classes/Time";
import { getTasks } from "@/lib/db/task";
import { Hour, Minute } from "@/lib/ts/types";

export default async function Home() {
  const tasks = ((await getTasks()) ?? []).map(
    (task) =>
      new Task(
        task.id,
        task.name,
        task.date.getDay(),
        new Time(
          task.date.getHours() as Hour,
          task.date.getMinutes() as Minute,
        ),
        task.priority,
      ),
  );

  return (
    <div className="flex min-h-full items-center justify-center [&>div]:w-[80%]">
      <ScheduleTable tasks={tasks} />
    </div>
  );
}
