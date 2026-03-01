import { Logger } from "@/components/logger/Logger";

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

/**
 * Reviver for JSON.parse, if value matches a datetime string, it will be parsed as a Date object.
 */
// explicit any here, because what else should be the type annotation?
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseJsonFixDate(_key: any, value: any) {
  if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d{3}Z)?$/)) {
    return new Date(value);
  }
  return value;
}
