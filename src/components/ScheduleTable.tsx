"use client";

import { days } from "@/lib/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Fragment, startTransition, useActionState, useEffect } from "react";
import { useNewTaskFormDefaultValuesStore } from "@/lib/stores/newTaskFormDefaultValuesStore";
import { Time as TimeClass } from "@/lib/classes/Time";
import { Time } from "@prisma/client";
import { useTasksStore } from "@/lib/stores/tasksStore";
import { PrismaTaskModified } from "@/lib/ts/interfaces";
import { useShouldOpenNewTaskFormStore } from "@/lib/stores/shouldOpenNewTaskFormStore";
import { Button } from "./ui/button";
import { CheckIcon, Trash2Icon, TriangleAlert } from "lucide-react";
import { removeTime } from "@/actions/time-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { removeTask } from "@/actions/task-actions";
import { useLiveQuery } from "dexie-react-hooks";
import { dexieDB } from "@/lib/db/dexieDB";
import { Hour } from "@/lib/ts/types";

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
  times: (TimeClass & Time)[];
  tasks: PrismaTaskModified[];
}

type ScheduleTableProps = GuestModeProps | RegularModeProps;

export default function ScheduleTable({
  times,
  tasks,
  isGuestMode,
}: ScheduleTableProps) {
  const dexieTimes = useLiveQuery(() => dexieDB.times.toArray());
  const dexieTasks = useLiveQuery(() => dexieDB.tasks.toArray());
  const { tasks: tasksFromStore, addTasks } = useTasksStore();
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
      toast(removeTimeActionState.error, { icon: <TriangleAlert /> });
    }

    if (removeTimeActionState?.success) {
      toast(removeTimeActionState.success, { icon: <CheckIcon /> });
    }
  }, [removeTimeActionState]);

  useEffect(() => {
    if (removeTaskActionState?.error) {
      toast(removeTaskActionState.error, { icon: <TriangleAlert /> });
    }

    if (removeTaskActionState?.success) {
      toast(removeTaskActionState.success, { icon: <CheckIcon /> });
    }
  }, [removeTaskActionState]);

  return (
    <>
      <Table
        id="schedule-table"
        className="table-fixed border border-black dark:border-white print:absolute print:top-9 print:left-1/2 print:w-[80%] print:-translate-x-1/2"
      >
        <TableHeader>
          <TableRow className="border-black dark:border-white">
            {/* Additional empty cell */}
            <TableHead className="bg-secondary"></TableHead>

            {days.map((day) => (
              <TableHead
                key={day}
                className="bg-secondary border-l border-black text-center text-black dark:border-white dark:text-white"
              >
                {day.toUpperCase()}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {(isGuestMode ? dexieTimes : times)?.map(
            (time, i, currentTimesArray) => (
              <Fragment key={time.id}>
                {/* A seperator row between the hours <= 12 and > 12 */}
                {time.hour >= 13 &&
                  currentTimesArray[i - 1] != null &&
                  currentTimesArray[i - 1]!.hour < 13 && (
                    <TableRow className="h-[1rem] border-black dark:border-white">
                      <TableCell className="bg-secondary text-center font-bold"></TableCell>

                      {[...Array(7)].map((_, i) => (
                        <TableCell
                          key={i}
                          className="bg-secondary border-l border-black dark:border-white"
                        />
                      ))}
                    </TableRow>
                  )}

                <TableRow className="h-[5rem] border-black hover:bg-transparent dark:border-white">
                  {/* Time cell (the first cell of each row) */}
                  <TableCell className="bg-secondary group relative text-center font-bold">
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 hidden size-8 group-hover:flex"
                      onClick={() => {
                        startTransition(() => {
                          removeTimeAction(time.id);
                        });
                      }}
                      disabled={removeTimeActionPending}
                    >
                      <Trash2Icon />
                    </Button>

                    <div className="contents">
                      {TimeClass.toString(time.hour, time.minute)}
                    </div>
                  </TableCell>

                  {[...Array(7)].map((_, j) => {
                    const task = tasksGroupedByDay[days[j]!]?.find(
                      (task) =>
                        task.time.hour === time.hour &&
                        task.time.minute === time.minute,
                    );

                    return (
                      <TableCell
                        key={j}
                        className="hover:bg-muted/70 active:bg-muted/90 cell group relative cursor-pointer border-l border-black py-6 text-center break-words hyphens-auto whitespace-break-spaces dark:border-white"
                        onClick={() => {
                          setDefaultDay(days[j]!);
                          setDefaultTime(time);
                          setDefaultTask(
                            (isGuestMode ? tasksFromStore : tasks).find(
                              (task) =>
                                days[task.day] === days[j] &&
                                TimeClass.equals(task.time, time),
                            ) ?? null,
                          );
                          openNewTaskForm();
                        }}
                      >
                        <Button
                          size="icon"
                          variant="destructive"
                          className={cn(
                            "!bg-destructive absolute top-2 right-2 hidden size-8",
                            task != null && "group-hover:flex",
                          )}
                          onClick={(e) => {
                            e.stopPropagation();

                            startTransition(() => {
                              removeTaskAction(task!.id);
                            });
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
    </>
  );
}
