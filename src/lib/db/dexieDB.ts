import Dexie, { EntityTable } from "dexie";
import { PrismaTaskModified, PrismaTimeModified } from "../ts/interfaces";

export const dexieDB = new Dexie("study-schedule") as Dexie & {
  tasks: EntityTable<Omit<PrismaTaskModified, "userId" | "time">, "id">;
  times: EntityTable<Omit<PrismaTimeModified, "userId">, "id">;
};

dexieDB.version(1).stores({
  tasks: "++id, name, day, priority, description, timeId",
  times: "++id, hour, minute, &[hour+minute]",
});
