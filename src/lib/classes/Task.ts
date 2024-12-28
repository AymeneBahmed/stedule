import { Time } from "./Time";
import { Day } from "../ts/enums";
import { Priority } from "@prisma/client";

export class Task {
  name: string;
  day: Day;
  time: Time;
  priority: Priority;
  description?: string;

  constructor(
    name: string,
    day: typeof this.day,
    time: Time,
    priority: typeof this.priority,
    description?: string,
  ) {
    this.name = name;
    this.day = day;
    this.time = time;
    this.priority = priority;
    this.description = description;
  }
}
