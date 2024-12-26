import { priorities } from "@/lib/constants";

export class Task {
  name: string;
  priority: (typeof priorities)[number];
  description?: string;

  constructor(
    name: string,
    priority: typeof this.priority,
    description?: string,
  ) {
    this.name = name;
    this.priority = priority;
    this.description = description;
  }
}
