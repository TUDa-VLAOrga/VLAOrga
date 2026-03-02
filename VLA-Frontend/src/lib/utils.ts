import {Logger} from "@/components/logger/Logger";
import {toJSONLocalTime} from "@/components/calendar/dateUtils.ts";

/**
 * Fetch a CSRF token from the server.
 */
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
        Logger.error("CSRF could not be fetched: ", error);
        reject(error);
      });
  });
}

/**
 * Wrapper for general requests to the backend server.
 * Abstracts away
 * - setting request headers and CSRF token.
 * - converting dates to localtime strings w/o timezone (JSON.stringify replacer)
 * - parsing localtime Date timestamps from returned JSON correctly (JSON.parse reviver)
 *
 * @throws Error if the response is not ok.
 */
export async function fetchBackend<T>(url: string, method: string, body?: T) {
  // fetch CSRF only on modifying method
  const headers = new Headers({
    'Content-Type': 'application/json',
  });
  if (method !== "GET")  {
    headers.set('X-CSRF-Token', await fetchCSRFToken());
  }
  const requestContent: RequestInit = {
    method: method,
    headers: headers,
  };
  if (body) {
    requestContent['body'] = JSON.stringify(body, toJsonFixDate);
  }
  const response = await fetch(url, requestContent).then(response => {
    if (!response.ok) {
      throw new Error("Error from request: " + response.statusText + ".");
    }
    return response;
  });
  return JSON.parse(await response.text(), parseJsonFixDate) as T;
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

const timestampPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d{3}(Z)?)?$/;

/**
 * Reviver for JSON.parse, if value matches a datetime string, it will be parsed as a Date object.
 */
// explicit any here, because what else should be the type annotation?
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseJsonFixDate(_key: any, value: any) {
  if (typeof value === "string" && value.match(timestampPattern)) {
    return new Date(value);
  }
  return value;
}

/**
 * Converts a Date object to a string in the format "yyyy-MM-ddTHH:mm:ss".
 */
// explicit any here, because what else should be the type annotation?
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toJsonFixDate(_key: any, value: any) {
  if (value instanceof Date) {
    return toJSONLocalTime(value);
  }
  // for some reason, during stringification JS passes a timestamp like 2026-02-28T00:00:00.000Z to this function
  // instead of a date object. But we can deal with that, too :)
  if (typeof value === "string" && value.match(timestampPattern)) {
    return  toJSONLocalTime(new Date(value));
  }
  return value;
}
