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
import { Fragment } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import NewTaskForm from "./NewTaskForm";
import { Time } from "@/lib/classes/Time";
import { Task } from "@/lib/classes/Task";
import { Hour, Minute } from "@/lib/ts/types";
import { Day } from "@/lib/ts/enums";
import { useDayAndTimeStore } from "@/lib/stores/dayAndTimeStore";

export default function ScheduleTable() {
  // prettier-ignore
  const tasks: Task[] = [
    new Task("Read a book", Day.Sunday, new Time(3, 10), "low", "Study as hard as you can"),
    new Task("Read a book", Day.Tuesday, new Time(12, 40), "low", "Study as hard as you can"),
    new Task("Read a book", Day.Saturday, new Time(16, 45), "medium", "Study as hard as you can"),
    new Task("Read a book", Day.Monday, new Time(3, 8), "high", "Study as hard as you can"),
    new Task("Read a book", Day.Friday, new Time(7, 20), "low", "Study as hard as you can"),
    new Task("Read a book", Day.Wednesday, new Time(11, 30), "medium", "Study as hard as you can"),
    new Task("Read a book", Day.Sunday, new Time(15, 40), "low", "Study as hard as you can"),
    new Task("Read a book", Day.Wednesday, new Time(9, 45), "low", "Study as hard as you can"),
    new Task("Read a book", Day.Thursday, new Time(12, 40), "low", "Study as hard as you can"),
    new Task("Read a book", Day.Monday, new Time(12, 40), "low", "Study as hard as you can"),
  ];
  const times: Time[] = tasks
    .map((task) => task.time)
    .toSorted((a, b) =>
      a.hour === b.hour ? a.minute - b.minute : a.hour - b.hour,
    );
  const timesWithoutDuplicates = Array.from(
    new Set(times.map((time) => JSON.stringify(time))),
  )
    .map<{ hour: Hour; minute: Minute }>((val) => JSON.parse(val))
    .map((val) => new Time(val.hour, val.minute));
  const tasksGroupedByDay = Object.groupBy(tasks, ({ day }) => days[day]);
  const { setDay, setTime } = useDayAndTimeStore();

  return (
    <Table className="border border-black dark:border-white">
      <TableHeader>
        <TableRow className="border-black dark:border-white">
          {/* Additional empty cell */}
          <TableHead className="bg-secondary"></TableHead>

          {days.map((day) => (
            <TableHead
              key={day}
              className="border-l border-black bg-secondary text-center text-black dark:border-white dark:text-white"
            >
              {day.toUpperCase()}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {timesWithoutDuplicates.map((time, i) => (
          <Fragment key={time.hour + time.minute + tasks[i].day + i}>
            {/* A seperator row between the hours <= 12 and > 12 */}
            {time.hour >= 13 && timesWithoutDuplicates[i - 1].hour < 13 && (
              <TableRow className="h-[1rem] border-black dark:border-white">
                <TableCell className="bg-secondary text-center font-bold"></TableCell>

                {[...Array(7)].map((_, i) => (
                  <TableCell
                    key={i}
                    className="border-l border-black bg-secondary dark:border-white"
                  />
                ))}
              </TableRow>
            )}

            <TableRow className="h-[5rem] border-black hover:bg-transparent dark:border-white">
              <TableCell className="bg-secondary text-center font-bold">
                {time.hour < 10 && "0"}
                {time.hour}:{time.minute < 10 && "0"}
                {time.minute}
              </TableCell>

              {[...Array(7)].map((_, j) => (
                <Dialog
                  key={j}
                  onOpenChange={() => {
                    setDay(days[j]);
                    setTime(time);
                  }}
                >
                  <DialogTrigger asChild>
                    <TableCell className="cursor-pointer border-l border-black text-center hover:bg-muted/70 active:bg-muted/90 dark:border-white">
                      {
                        tasksGroupedByDay[days[j]]?.find(
                          (task) =>
                            task.time.hour === time.hour &&
                            task.time.minute === time.minute,
                        )?.name
                      }
                    </TableCell>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>What do you want to do?</DialogTitle>
                      <DialogDescription className="sr-only">
                        Create a task and add an optional description such as
                        notes.
                      </DialogDescription>
                    </DialogHeader>

                    <NewTaskForm />
                  </DialogContent>
                </Dialog>
              ))}
            </TableRow>
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
