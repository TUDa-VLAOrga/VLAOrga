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
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(data => {
        resolve(data.token);
    })
    .catch(error => {
        Logger.error("CSRF could not be fetched");
        console.log(error);
        reject(error)
    })
  });
}
