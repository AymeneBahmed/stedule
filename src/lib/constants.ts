import { Priority } from "@prisma/client";

export const APP_NAME = "Stedule";

export const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export const priorities: Priority[] = ["Unspecified", "Low", "Medium", "High"];
