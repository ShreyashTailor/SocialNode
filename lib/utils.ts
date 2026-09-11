import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: (string | undefined | null | false | Record<string, any>)[]): string {
  return twMerge(clsx(inputs));
}
