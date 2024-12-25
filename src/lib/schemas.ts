import { z } from "zod";

export const newTaskSchema = z.object({
  task: z.string().min(1, { message: "This field is required!" }),
  description: z.string().optional(),
});
