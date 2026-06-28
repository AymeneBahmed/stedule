"use client";

import { days } from "@/lib/constants";
import { Table, TableBody, TableRow } from "../ui/table";
import { Fragment, startTransition, useEffect } from "react";
import { useNewTaskFormDefaultValuesStore } from "@/lib/stores/newTaskFormDefaultValuesStore";
import { Time as TimeClass } from "@/lib/classes/Time";
import {
  isPrismaTask,
  TaskFromStore,
  useTasksStore,
} from "@/lib/stores/tasksStore";
import { PrismaTaskModified, PrismaTimeModified } from "@/lib/ts/interfaces";
import { useShouldOpenNewTaskFormStore } from "@/lib/stores/shouldOpenNewTaskFormStore";
import { toast } from "sonner";
import { useLiveQuery } from "dexie-react-hooks";
import { dexieDB } from "@/lib/db/dexieDB";
import { Hour } from "@/lib/ts/types";
import { ScheduleTableHeader } from "./ScheduleTableHeader";
import { ScheduleTableTimeSeparator } from "./ScheduleTableTimeSeparator";
import { ScheduleTableTimeCell } from "./ScheduleTableTimeCell";
import { ScheduleTableTaskCell } from "./ScheduleTableTaskCell";
import { useScheduleActions } from "@/hooks/use-schedule-actions";

interface BaseScheduleTableProps {
  isGuestMode?: boolean;
}

interface GuestModeProps extends BaseScheduleTableProps {
  isGuestMode: true;
  serverTimes?: never;
  serverTasks?: never;
}

interface RegularModeProps extends BaseScheduleTableProps {
  isGuestMode?: false;
  serverTimes: PrismaTimeModified[];
  serverTasks: PrismaTaskModified[];
}

type ScheduleTableProps = GuestModeProps | RegularModeProps;

export function ScheduleTable({
  serverTimes,
  serverTasks,
  isGuestMode,
}: ScheduleTableProps) {
  const dexieTimes = useLiveQuery(() => dexieDB.times.toArray());
  const dexieTasks = useLiveQuery(() => dexieDB.tasks.toArray());

  const {
    tasks: tasksFromStore,
    addTasks: addTasksToStore,
    deleteTasks: deleteTasksFromStore,
  } = useTasksStore();
  const tasksGroupedByDay = Object.groupBy(
    isGuestMode ? tasksFromStore : serverTasks,
    (task) => days[task.day],
  );

  const { setDefaultDay, setDefaultTime, setDefaultTask } =
    useNewTaskFormDefaultValuesStore();
  const { openNewTaskForm } = useShouldOpenNewTaskFormStore();

  const {
    removeTimeAction,
    removeTimeActionPending,
    removeTaskAction,
    removeTaskActionPending,
  } = useScheduleActions();

  // Sync state & data side effects
  useEffect(() => {
    if (!isGuestMode) {
      // add tasks to the store
      addTasksToStore(serverTasks);
    } else {
      // Wait for dexie to fetch tasks from IndexedDB then add them to the store
      if (dexieTasks != null) addTasksToStore(dexieTasks);

      // Add default times if IndexedDB is empty.
      if (dexieTimes?.length === 0) {
        dexieDB.times.bulkAdd(
          Array.from({ length: 8 }, (_, i) => ({
            hour: (i + 8) as Hour,
            minute: 0,
          })),
        );
      }
    }
  }, [
    addTasksToStore,
    dexieTasks,
    dexieTimes?.length,
    isGuestMode,
    serverTasks,
  ]);

  // Handlers
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

          deleteTasksFromStore(tasksIDs);

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

  function handleDeleteTask(taskId: TaskFromStore["id"]) {
    startTransition(async () => {
      if (isGuestMode) {
        try {
          await dexieDB.tasks.delete(taskId);

          deleteTasksFromStore([taskId]);

          toast.success("Removed task successfully!");
        } catch {
          // TODO: handle all possible errors
          toast.error("Something went wrong! Please try again.");
        }
      } else {
        removeTaskAction(taskId);
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
        {(isGuestMode ? dexieTimes : serverTimes)?.map(
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
                  // Task is undefined for empty cells
                  const task = tasksGroupedByDay[days[dayIndex]!]?.find(
                    (task) => {
                      if (isPrismaTask(task)) {
                        return TimeClass.equals(task.time, time);
                      }

                      const matchedDexieTime = dexieTimes?.find(
                        (dexieTime) => dexieTime.id === task.timeId,
                      );

                      return matchedDexieTime
                        ? TimeClass.equals(matchedDexieTime, time)
                        : false;
                    },
                  );

                  return (
                    <ScheduleTableTaskCell
                      key={dayIndex}
                      taskName={task?.name}
                      disabled={removeTaskActionPending}
                      onClick={() => {
                        setDefaultDay(days[dayIndex]!);
                        setDefaultTime(time);
                        setDefaultTask(task ?? null);
                        openNewTaskForm();
                      }}
                      onDelete={() => task != null && handleDeleteTask(task.id)}
                    />
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
