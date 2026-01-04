import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nationalities = [
  { label: "American", value: "american" },
  { label: "Australian", value: "australian" },
  { label: "British", value: "british" },
  { label: "Bangladeshi", value: "bangladeshi" },
  { label: "Canadian", value: "canadian" },
  { label: "French", value: "french" },
  { label: "German", value: "german" },
  { label: "Indian", value: "indian" },
  { label: "Japanese", value: "japanese" },
].sort((a, b) => a.label.localeCompare(b.label));

export const nationalityToCode: Record<string, string> = {
  american: "us",
  australian: "au",
  bangladeshi: "bd",
  british: "gb",
  canadian: "ca",
  french: "fr",
  german: "de",
  indian: "in",
  japanese: "jp",
};
