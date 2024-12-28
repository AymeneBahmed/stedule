import { Time } from "./Time";
import { Day } from "../ts/enums";
import { Priority } from "@prisma/client";

export class Task {
  id: number;
  name: string;
  day: Day;
  time: Time;
  priority: Priority;
  description?: string;

  constructor(
    id: number,
    name: string,
    day: Day,
    time: Time,
    priority: Priority,
    description?: string,
  ) {
    this.id = id;
    this.name = name;
    this.day = day;
    this.time = time;
    this.priority = priority;
    this.description = description;
  }
}
