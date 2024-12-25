import { z } from "zod";

export const newTaskSchema = z.object({
  task: z.string().min(1, { message: "This field is required!" }),
  priority: z.enum(["unspecified", "low", "medium", "high"]),
  description: z.string().optional(),
});
