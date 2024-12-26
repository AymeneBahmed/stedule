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

export default function ScheduleTable() {
  const hours = Array.from({ length: 9 }, (_, i) => i + 8);
  // prettier-ignore
  const tasks: Task[] = [
    new Task("Read a book", "sunday", new Time(3, 10), "low", "Study as hard as you can"),
    new Task("Read a book", "sunday", new Time(12, 40), "low", "Study as hard as you can"),
    new Task("Read a book", "sunday", new Time(16, 45), "medium", "Study as hard as you can"),
    new Task("Read a book", "sunday", new Time(3, 8), "high", "Study as hard as you can"),
    new Task("Read a book", "sunday", new Time(7, 20), "low", "Study as hard as you can"),
    new Task("Read a book", "sunday", new Time(11, 30), "medium", "Study as hard as you can"),
    new Task("Read a book", "sunday", new Time(15, 40), "low", "Study as hard as you can"),
    new Task("Read a book", "sunday", new Time(9, 45), "low", "Study as hard as you can"),
  ];

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
        {hours.map((hour, i) => (
          <Fragment key={hour}>
            {/* A seperator row between the hours <= 12 and > 12 */}
            {hour >= 13 && hours[i - 1] < 13 && (
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
                {hour}:00 {hour < 12 ? "AM" : "PM"}
              </TableCell>

              {[...Array(7)].map((_, i) => (
                <Dialog key={i}>
                  <DialogTrigger asChild>
                    <TableCell className="cursor-pointer border-l border-black hover:bg-muted/70 active:bg-muted/90 dark:border-white" />
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
