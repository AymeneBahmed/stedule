import { Task } from "@prisma/client";
import { Hour, Minute } from "./types";
import { Day } from "./enums";

export interface PrismaTaskModified extends Task {
  day: Day;
  time: {
    hour: Hour;
    minute: Minute;
  };
}
