import { priorities } from "@/lib/constants";
import { Time } from "./Time";
import { Day } from "../ts/enums";

export class Task {
  name: string;
  day: Day;
  time: Time;
  priority: (typeof priorities)[number];
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
