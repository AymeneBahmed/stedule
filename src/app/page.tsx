import ScheduleTable from "@/components/ScheduleTable";
import { Task } from "@/lib/classes/Task";
import { getTasks } from "@/lib/db/task";

export default async function Home() {
  const tasks = ((await getTasks()) ?? []).map<Task>((task) => ({
    ...task,
    description: task.description ?? undefined,
  }));

  return (
    <div className="flex min-h-full items-center justify-center [&>div]:w-[80%]">
      <ScheduleTable tasks={tasks} />
    </div>
  );
}
