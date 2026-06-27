"use client";

import { days } from "@/lib/constants";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { Fragment, startTransition, useActionState, useEffect } from "react";
import { useNewTaskFormDefaultValuesStore } from "@/lib/stores/newTaskFormDefaultValuesStore";
import { Time as TimeClass } from "@/lib/classes/Time";
import {
  isPrismaTask,
  TaskFromStore,
  useTasksStore,
} from "@/lib/stores/tasksStore";
import { PrismaTaskModified, PrismaTimeModified } from "@/lib/ts/interfaces";
import { useShouldOpenNewTaskFormStore } from "@/lib/stores/shouldOpenNewTaskFormStore";
import { Button } from "../ui/button";
import { Trash2Icon } from "lucide-react";
import { removeTime } from "@/actions/time-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { removeTask } from "@/actions/task-actions";
import { useLiveQuery } from "dexie-react-hooks";
import { dexieDB } from "@/lib/db/dexieDB";
import { Hour } from "@/lib/ts/types";
import { ScheduleTableHeader } from "./ScheduleTableHeader";
import { ScheduleTableTimeSeparator } from "./ScheduleTableTimeSeparator";
import { ScheduleTableTimeCell } from "./ScheduleTableTimeCell";

interface BaseScheduleTableProps {
  isGuestMode?: boolean;
}

interface GuestModeProps extends BaseScheduleTableProps {
  isGuestMode: true;
  times?: never;
  tasks?: never;
}

interface RegularModeProps extends BaseScheduleTableProps {
  isGuestMode?: false;
  times: PrismaTimeModified[];
  tasks: PrismaTaskModified[];
}

type ScheduleTableProps = GuestModeProps | RegularModeProps;

export function ScheduleTable({
  times,
  tasks,
  isGuestMode,
}: ScheduleTableProps) {
  const dexieTimes = useLiveQuery(() => dexieDB.times.toArray());
  const dexieTasks = useLiveQuery(() => dexieDB.tasks.toArray());
  const { tasks: tasksFromStore, addTasks, deleteTasks } = useTasksStore();
  const tasksGroupedByDay = Object.groupBy(
    isGuestMode ? tasksFromStore : tasks,
    ({ day }) => days[day],
  );
  const { setDefaultDay, setDefaultTime, setDefaultTask } =
    useNewTaskFormDefaultValuesStore();
  const { openNewTaskForm } = useShouldOpenNewTaskFormStore();
  const [removeTimeActionState, removeTimeAction, removeTimeActionPending] =
    useActionState(removeTime, null);
  const [removeTaskActionState, removeTaskAction, removeTaskActionPending] =
    useActionState(removeTask, null);

  useEffect(() => {
    if (!isGuestMode) {
      addTasks(tasks);
    }

    if (isGuestMode) {
      if (dexieTasks != null) {
        addTasks(dexieTasks);
      }

      if (dexieTimes?.length === 0) {
        dexieDB.times.bulkAdd(
          Array.from({ length: 8 }, (_, i) => ({
            hour: (i + 8) as Hour,
            minute: 0,
          })),
        );
      }
    }
  }, [addTasks, dexieTasks, dexieTimes?.length, isGuestMode, tasks]);

  useEffect(() => {
    if (removeTimeActionState?.error) {
      toast.error(removeTimeActionState.error);
    }

    if (removeTimeActionState?.success) {
      toast.success(removeTimeActionState.success);
    }
  }, [removeTimeActionState]);

  useEffect(() => {
    if (removeTaskActionState?.error) {
      toast.error(removeTaskActionState.error);
    }

    if (removeTaskActionState?.success) {
      toast.success(removeTaskActionState.success);
    }
  }, [removeTaskActionState]);

  function handleDeleteTime(time: Omit<PrismaTimeModified, "userId">) {
    startTransition(async () => {
      if (isGuestMode) {
        try {
          const tasksCollection = dexieDB.tasks.where({
            timeId: time.id,
          });
          const tasksIDs = (await tasksCollection.toArray()).map(
            ({ id }) => id,
          );

          await Promise.all([
            dexieDB.times.delete(time.id),
            tasksCollection.delete(),
          ]);

          deleteTasks(tasksIDs);

          toast.success(
            `Removed time ${TimeClass.toString(time.hour, time.minute)} successfully!`,
          );
        } catch {
          // TODO: handle all possible errors
          toast.error(`Something went wrong! Please try again.`);
        }
      } else {
        removeTimeAction(time.id);
      }
    });
  }

  function handleDeleteTask(task: TaskFromStore | undefined) {
    startTransition(async () => {
      if (isGuestMode) {
        try {
          await dexieDB.tasks.delete(task!.id);

          deleteTasks([task!.id]);

          toast.success("Removed task successfully!");
        } catch {
          // TODO: handle all possible errors
          toast.error("Something went wrong! Please try again.");
        }
      } else {
        removeTaskAction(task!.id);
      }
    });
  }

  return (
    <Table
      id="schedule-table"
      className="table-fixed border border-black dark:border-white print:absolute print:top-9 print:left-1/2 print:w-[80%] print:-translate-x-1/2"
    >
      <ScheduleTableHeader />

      <TableBody>
        {(isGuestMode ? dexieTimes : times)?.map(
          (time, i, currentTimesArray) => (
            <Fragment key={time.id}>
              {/* A separator row between the hours <= 12 and > 12 */}
              {time.hour >= 13 &&
                currentTimesArray[i - 1] != null &&
                currentTimesArray[i - 1]!.hour < 13 && (
                  <ScheduleTableTimeSeparator />
                )}

              <TableRow className="h-[5rem] border-black hover:bg-transparent dark:border-white">
                {/* Time cell (the first cell of each row) */}
                <ScheduleTableTimeCell
                  onDelete={() => handleDeleteTime(time)}
                  disabled={removeTimeActionPending}
                  time={time}
                />

                {[...Array(7)].map((_, dayIndex) => {
                  const task = tasksGroupedByDay[days[dayIndex]!]?.find(
                    (task) => {
                      if (isPrismaTask(task)) {
                        return TimeClass.equals(task.time, time);
                      }

                      const existingTime = dexieTimes?.find(
                        (dexieTime) => dexieTime.id === task.timeId,
                      );

                      if (existingTime == null) {
                        return;
                      }

                      return TimeClass.equals(existingTime, time);
                    },
                  );

                  return (
                    <TableCell
                      key={dayIndex}
                      className="hover:bg-muted/70 active:bg-muted/90 cell group relative cursor-pointer border-l border-black py-6 text-center break-words hyphens-auto whitespace-break-spaces dark:border-white"
                      onClick={() => {
                        setDefaultDay(days[dayIndex]!);
                        setDefaultTime(time);
                        setDefaultTask(task ?? null);
                        openNewTaskForm();
                      }}
                    >
                      <Button
                        size="icon"
                        variant="destructive"
                        className={cn(
                          "absolute top-2 right-2 hidden size-8",
                          task != null && "group-hover:flex",
                        )}
                        onClick={(e) => {
                          e.stopPropagation();

                          handleDeleteTask(task);
                        }}
                        disabled={removeTaskActionPending}
                      >
                        <Trash2Icon />
                      </Button>

                      <div className="line-clamp-3 flex min-h-8 items-center justify-center text-ellipsis">
                        {task?.name}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            </Fragment>
          ),
        )}
      </TableBody>
    </Table>
  );
}
