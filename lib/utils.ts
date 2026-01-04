import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nationalities = [
  { label: "American", value: "american" },
  { label: "British", value: "british" },
  { label: "Bangladesh", value: "bangladesh" },
  { label: "Canadian", value: "canadian" },
  { label: "French", value: "french" },
  { label: "German", value: "german" },
  { label: "Indian", value: "indian" },
  { label: "Japanese", value: "japanese" },
].sort((a, b) => a.label.localeCompare(b.label));
