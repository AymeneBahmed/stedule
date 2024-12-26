import { z } from "zod";
import { days, priorities } from "./constants";

export const newTaskSchema = z.object({
  task: z.string().min(1, { message: "This field is required!" }),
  day: z.enum(days),
  priority: z.enum(priorities),
  description: z.string(),
});
