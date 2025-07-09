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
import { Fragment, useEffect } from "react";
import { useNewTaskFormDefaultValuesStore } from "@/lib/stores/newTaskFormDefaultValuesStore";
import { Time as TimeClass } from "@/lib/classes/Time";
import { Time } from "@prisma/client";
import { useTasksStore } from "@/lib/stores/tasksStore";
import { PrismaTaskModified } from "@/lib/ts/interfaces";
import { useShouldOpenNewTaskFormStore } from "@/lib/stores/shouldOpenNewTaskFormStore";

interface ScheduleTableProps {
  times: (TimeClass & Time)[];
  tasks: PrismaTaskModified[];
}

export default function ScheduleTable({ times, tasks }: ScheduleTableProps) {
  const tasksGroupedByDay = Object.groupBy(tasks, ({ day }) => days[day]);
  const { setDefaultDay, setDefaultTime, setDefaultTask } =
    useNewTaskFormDefaultValuesStore();
  const { addTasks } = useTasksStore();
  const { openNewTaskForm } = useShouldOpenNewTaskFormStore();

  useEffect(() => {
    addTasks(tasks);
  }, [addTasks, tasks]);

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
          {times.map((time, i) => (
            <Fragment key={time.id}>
              {/* A seperator row between the hours <= 12 and > 12 */}
              {time.hour >= 13 &&
                times[i - 1] != null &&
                times[i - 1]!.hour < 13 && (
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
                <TableCell className="bg-secondary text-center font-bold">
                  {time.hour < 10 && "0"}
                  {time.hour}:{time.minute < 10 && "0"}
                  {time.minute}
                </TableCell>

                {[...Array(7)].map((_, j) => (
                  <TableCell
                    key={j}
                    className="hover:bg-muted/70 active:bg-muted/90 cell cursor-pointer border-l border-black py-4 text-center break-words hyphens-auto whitespace-break-spaces dark:border-white"
                    onClick={() => {
                      setDefaultDay(days[j]!);
                      setDefaultTime(time);
                      setDefaultTask(
                        tasks.find(
                          (task) =>
                            days[task.day] === days[j] &&
                            TimeClass.equals(task.time, time),
                        ) ?? null,
                      );
                      openNewTaskForm();
                    }}
                  >
                    {
                      tasksGroupedByDay[days[j]!]?.find(
                        (task) =>
                          task.time.hour === time.hour &&
                          task.time.minute === time.minute,
                      )?.name
                    }
                  </TableCell>
                ))}
              </TableRow>
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
