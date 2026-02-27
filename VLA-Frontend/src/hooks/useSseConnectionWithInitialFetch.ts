import { useEffect } from "react";
import useSseConnection from "./useSseConnection";
import { Logger } from "@/components/logger/Logger";
import type { SseMessageType } from "@/lib/databaseTypes";

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
  eventHandlers: Map<SseMessageType, (event: MessageEvent, value: T) => T>,
  postProcess?: (value: T) => T
)
  : [T, React.Dispatch<React.SetStateAction<T>>]
{
  const [sseDefaultValue, setsseDefaultValue] = useSseConnection<T>(defaultValue, eventHandlers);

  /**
   * Conducts the inital fetch and updates the component if it still exists.
   */
  useEffect(() => {
    // If component does still exist and state can be changed
    let mounted = true;

    fetch(apiResourceURL)
      .then(response => {
        // Trigger catch case on fetching error
        if(!response.ok) throw new Error();
        return response.json();
      })

      .then(parsedObj => {
        if (mounted) {
          if (postProcess) {
            parsedObj = postProcess(parsedObj);
          }
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

  return [sseDefaultValue, setsseDefaultValue] as const;
}
