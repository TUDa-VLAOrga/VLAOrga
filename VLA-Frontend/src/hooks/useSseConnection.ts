import { SSEHandler } from "@/components/sse/SseHandler";
import SseHookObserver from "@/components/sse/SseHookObserver";
import type { SseMessageType } from "@/components/sse/SseMessageType";
import { useEffect, useState } from "react";

/**
 * Creates a variable that may be updated by a handler.
 * @param initialValue The inital value of that variable
 * @param eventHandlers They take a messageEvent and the current value and return the new value
 * @returns The reactive variable with its setter
 */
export default function useSseConnection<T>(
  initialValue: T, 
  eventHandlers: Map<SseMessageType, (event: MessageEvent, currentValue: T) => T>
){
  const [value, setValue] = useState<T>(initialValue);

  /**
   * Delegates the SseEvent to the appropriate handler
   * @param event The event that invoked the observer of the object
   * @returns A trigger for rerendering
   */
  function handleSseMessage(event: MessageEvent){
    // All SseMessagesType may or may not be supported
    if(!eventHandlers.has(event.type as SseMessageType)) return;

    // This updates the trigger of the rendering function
    setValue(eventHandlers.get(event.type as SseMessageType)!(event, value));
  }

  /**
   * Initializes the observer and removes it on unmount
   * Runs when the component is mounted
   */
  useEffect(() => {
    const obs: SseHookObserver = new SseHookObserver(handleSseMessage);
    SSEHandler.registerObserver(obs);

    return () => SSEHandler.removeObserver(obs);
    // Empty dependency array as we only want to run it once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [value, setValue] as const;
}
