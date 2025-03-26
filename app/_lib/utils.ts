import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatName = (name: string) => {
  const excludedWords = ["de", "da", "do", "e"];
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => {
      if (excludedWords.includes(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};
