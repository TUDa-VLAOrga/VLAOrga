import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let internalNotSynchronisedId = -1;

export function getNotSynchronisedId() {
  return internalNotSynchronisedId--;
}
