import { z } from "zod";
import { days } from "./constants";

export const newTaskSchema = z.object({
  task: z.string().min(1, { message: "This field is required!" }),
  day: z.enum(days),
  priority: z.enum(["unspecified", "low", "medium", "high"]),
  description: z.string(),
});
