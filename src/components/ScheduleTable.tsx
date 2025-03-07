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
import { useNewTaskFormDefaultValuesStore } from "@/lib/stores/newTaskFormDefaultValuesStore";
import { Task } from "@/lib/classes/Task";
import { useShouldOpenNewTaskFormStore } from "@/lib/stores/shouldOpenNewTaskFormStore";
import { Time } from "@/lib/classes/Time";
import { useEditTaskModeStore } from "@/lib/stores/editTaskModeStore";
import { cn } from "@/lib/utils";

interface ScheduleTableProps {
  times: Time[];
  tasks: Task[];
}

export default function ScheduleTable({ times, tasks }: ScheduleTableProps) {
  const tasksGroupedByDay = Object.groupBy(tasks, ({ day }) => days[day]);
  const {
    defaultDay,
    defaultTime,
    setDefaultDay,
    setDefaultTime,
    setDefaultTask,
  } = useNewTaskFormDefaultValuesStore();
  const { shouldOpenNewTaskForm, openNewTaskForm, closeNewTaskForm } =
    useShouldOpenNewTaskFormStore();
  const { editTaskModeEnabled } = useEditTaskModeStore();

  return (
    <Table className="border border-black dark:border-white">
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
          <Fragment key={time.hour + time.minute + i}>
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
                <Dialog
                  key={j}
                  open={
                    // These checks were added to prevent the slow opening of the dialog
                    defaultDay === days[j] &&
                    defaultTime != null &&
                    Time.equals(defaultTime, time) &&
                    shouldOpenNewTaskForm
                  }
                  onOpenChange={(val) => {
                    // on closing the dialog
                    if (!val) {
                      setDefaultDay(null);
                      setDefaultTime(null);
                      setDefaultTask(null);
                      closeNewTaskForm();
                    }
                    // On opening the dialog
                    else {
                      setDefaultDay(days[j]!);
                      setDefaultTime(time);
                      setDefaultTask(
                        tasks.find(
                          (task) =>
                            days[task.day] === days[j] &&
                            Time.equals(task.time, time),
                        ) ?? null,
                      );
                      openNewTaskForm();
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <TableCell className="hover:bg-muted/70 active:bg-muted/90 cursor-pointer border-l border-black text-center dark:border-white">
                      {
                        tasksGroupedByDay[days[j]!]?.find(
                          (task) =>
                            task.time.hour === time.hour &&
                            task.time.minute === time.minute,
                        )?.name
                      }
                    </TableCell>
                  </DialogTrigger>

                  <DialogContent className="gap-0">
                    <DialogHeader>
                      <DialogTitle>
                        What do you want to do?{" "}
                        <span
                          className={cn(
                            "rounded bg-blue-700 px-2 py-0.5 text-sm text-white",
                            !editTaskModeEnabled && "invisible",
                          )}
                        >
                          Edit
                        </span>
                      </DialogTitle>
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
