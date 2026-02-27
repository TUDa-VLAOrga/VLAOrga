import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Do not re-assign this variable otherwise than in the function below!
 */
let internalNotSynchronisedId = -1;

/**
 * Get a unique negative number usable as proto-type ID as long as an entity is not synced with the server yet.
 */
export function getNotSynchronisedId() {
  return internalNotSynchronisedId--;
}
