import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// utility for SWR
export async function fetcher(...args: Parameters<typeof fetch>) {
  return await (await fetch(...args)).json();
}
