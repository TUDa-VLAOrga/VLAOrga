import { Logger } from "@/components/logger/Logger";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const NotSynchronisedId = -1;

export function fetchCSRFToken(){
  return new Promise<string>((resolve, reject) => {
    fetch('/csrf', {
      credentials: 'same-origin',
    })
      .then(response => response.json())
      .then(data => {
        resolve(data.token);
      })
      .catch(error => {
        Logger.error("CSRF could not be fetched");
        console.log(error);
        reject(error);
      });
  });
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
