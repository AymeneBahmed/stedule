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

export const SignupSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1),
  remember: z.boolean().default(false),
});

export const VerifyEmailSchema = z.object({
  code: z.string().min(6, { message: "The code must contain 6 digits." }),
});
