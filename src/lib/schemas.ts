import { z } from "zod";
import { days, priorities } from "./constants";

export const newTaskSchema = z.object({
  task: z.string().min(1, { error: "This field is required." }),
  day: z.enum(days, { error: "Invalid day." }),
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
    { error: "Invalid time." },
  ),
  priority: z.enum(priorities as unknown as [(typeof priorities)[number]], {
    error: "Invalid priority.",
  }),
  description: z.string().optional(),
});

export const newTimeSchema = z.object({
  time: newTaskSchema.shape.time,
});

export const signupSchema = z.object({
  fullName: z.string().min(2, {
    error: "Full name must be at least 2 characters.",
  }),
  email: z.email({
    error: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    error: "Password must be at least 8 characters.",
  }),
});

export const loginSchema = z.object({
  email: z.email({
    error: "Please enter a valid email address.",
  }),
  password: z.string().min(1),
  remember: z.boolean().default(false),
});

export const verifyEmailSchema = z.object({
  code: z.string().min(6, { error: "The code must contain 6 digits." }),
});

export const profileInformationSchema = z.object({
  fullName: z.string().min(2, {
    error: "Full name must be at least 2 characters.",
  }),
  email: z.email({
    error: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .nonempty({ error: "Please enter your password to save changes." }),
});

export const updatePasswordSchema = z
  .object({
    oldPassword: z.string().nonempty({
      error: "Please enter the old password.",
    }),
    newPassword: z.string().min(8, {
      error: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      error: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    error: "New password must be different from old password.",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const createCredentialAccountSchema = z
  .object({
    password: z.string().min(8, {
      error: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      error: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const deleteUserSchema = z.object({
  delete: z.literal("DELETE", {
    error: "Please enter the word DELETE to continue.",
  }),
});

export const removePasswordSchema = z.object({
  currentPassword: z
    .string()
    .nonempty({ error: "Please enter your current password to continue." }),
});
