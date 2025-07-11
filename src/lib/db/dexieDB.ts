import { Task, Time } from "@prisma/client";
import Dexie, { EntityTable } from "dexie";

export const dexieDB = new Dexie("study-schedule") as Dexie & {
  tasks: EntityTable<Omit<Task, "userId">, "id">;
  times: EntityTable<Omit<Time, "userId">, "id">;
};

dexieDB.version(1).stores({
  tasks: "++id, name, day, priority, description, timeId",
  times: "++id, hour, minute, &[hour+minute]",
});
