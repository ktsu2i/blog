import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Comparator for sorting by date, newest first */
export function compareByDateDesc(
  a: { date: string },
  b: { date: string },
): number {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}
