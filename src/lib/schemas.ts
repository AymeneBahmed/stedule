import { z } from "zod";
import { days, priorities } from "./constants";

export const newTaskSchema = z.object({
  task: z.string().min(1, { message: "This field is required!" }),
  day: z.enum(days, { message: "Invalid day!" }),
  time: z.string().refine(
    (time) => {
      const [hour, min] = time.split(":").map(Number);

      return (
        time.length === 5 &&
        !isNaN(hour!) &&
        !isNaN(min!) &&
        hour! >= 0 &&
        hour! <= 23 &&
        min! >= 0 &&
        min! <= 59
      );
    },
    { message: "Invalid time!" },
  ),
  priority: z.enum(priorities as unknown as [(typeof priorities)[number]], {
    message: "Invalid priority!",
  }),
  description: z.string().optional(),
});

export const newTimeSchema = z.object({
  time: newTaskSchema.shape.time,
});
