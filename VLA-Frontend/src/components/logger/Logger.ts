import type { Dispatch, SetStateAction } from "react";
import { LogEvent, LogLevel, type LogMessage } from "./LoggerTypes";

export class Logger {
  /**
     * Contains all relevant log messages
     * The first index is the latest message
     */
  private static logMessages: LogMessage[] = [];
  private static loggerReferenceSetter?: Dispatch<SetStateAction<LogMessage[]>>;

  /**
     * Creates an info log entry for a given message
     * @param message Message to log
     * @param event Optional event declaration for improved log filtering
     */
  static info(message: string, event?: LogEvent){
    Logger.customLogMessage(LogLevel.INFO, message, event);
  }

  /**
     * Creates an warn log entry for a given message
     * @param message Message to log
     * @param event Optional event declaration for improved log filtering
     */
  static warn(message: string, event?: LogEvent){
    Logger.customLogMessage(LogLevel.WARN, message, event);
  }

  /**
     * Creates an error log entry for a given message
     * @param message Message to log
     * @param event Optional event declaration for improved log filtering
     */
  static error(message: string, event?: LogEvent){
    Logger.customLogMessage(LogLevel.ERROR, message, event);
  }

  /**
     * Creates a log message, inserts it into the logger history and updates the Logger component
     * @param level Level of the log message
     * @param message The message to log
     * @param event Optional event declaration for improved log filtering
     */
  static customLogMessage(level: LogLevel, message: string, event?: LogEvent){
        
    const newMessage: LogMessage = {
      date: new Date(),
      level: level,
      message: message,
      eventType: event,
    }

    const newMessageHistory : LogMessage[] = [newMessage, ...Logger.logMessages];
    Logger.logMessages = newMessageHistory;

    Logger.updateComponent(newMessageHistory);
  }

  private static updateComponent(messages: LogMessage[]){
    // Only log if logging component is ready
    if(Logger.loggerReferenceSetter)
      Logger.loggerReferenceSetter(messages);
  }

  static overrideComponenentMessageSetterRef(setter: Dispatch<SetStateAction<LogMessage[]>>){
    Logger.loggerReferenceSetter = setter;
    Logger.info("Updating logger component setter");
  }
}
