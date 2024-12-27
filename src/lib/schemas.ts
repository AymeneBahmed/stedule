import { z } from "zod";
import { days, priorities } from "./constants";

export const newTaskSchema = z.object({
  task: z.string().min(1, { message: "This field is required!" }),
  day: z.enum(days),
  time: z.string().refine(
    (time) => {
      const [hour, min] = time.split(":").map(Number);

      return (
        !isNaN(hour) &&
        !isNaN(min) &&
        hour >= 0 &&
        hour <= 23 &&
        min >= 0 &&
        min <= 59
      );
    },
    { message: "Invalid time!" },
  ),
  priority: z.enum(priorities),
  description: z.string(),
});
