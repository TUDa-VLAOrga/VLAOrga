import type { SseMessageType } from "@/components/sse/SseMessageType";
import { useEffect } from "react";
import useSseConnection from "./useSseConnection";
import { Logger } from "@/components/logger/Logger";

/**
 * Extension of {@link useSseConnection} but directly initiates a fetch for data
 * @param defaultValue The default value to taken on before the value is fetched
 * @param apiResourceURL The api endpoint relative to the host of the JSON resource
 * @param eventHandlers Take a MessageEvent and the current value and return the new value
 * @returns The reactive variable
 */
export default function useSseConnectionWithInitialFetch<T extends object>(
  defaultValue: T, 
  apiResourceURL : string,
  eventHandlers: Map<SseMessageType, (event: MessageEvent, value: T) => T>
){
  const [sseDefaultValue, setsseDefaultValue] = useSseConnection<T>(defaultValue, eventHandlers);

  /**
   * Conducts the inital fetch and updates the component if it still exists.
   */
  useEffect(() => {
    let mounted = true;

    fetch(apiResourceURL)
      .then(response => {
        // Trigger catch case on fetching error
        if(!response.ok) throw new Error();
        return response.json();
      })

      .then(parsedObj => {
        if (mounted){
          setsseDefaultValue(parsedObj);
        }
      })

      .catch(_ => 
        Logger.warn("Could not fetch data")
      );

    return () => {
      mounted = false;
    };
    // Empty dependency array as we only want to run it once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return sseDefaultValue;
}
