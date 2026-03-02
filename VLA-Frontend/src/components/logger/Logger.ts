import type { Dispatch, SetStateAction } from "react";
import { LogLevel, type LogMessage } from "./LoggerTypes";

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
     * @param context Optional context for the log message, e.g. an error object.
     */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static info(message: string, context?: any){
    Logger.customLogMessage(LogLevel.INFO, message, context);
  }

  /**
     * Creates an warn log entry for a given message
     * @param message Message to log
     * @param context Optional context for the log message, e.g. an error object.
     */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static warn(message: string, context?: any){
    Logger.customLogMessage(LogLevel.WARN, message, context);
  }

  /**
     * Creates an error log entry for a given message
     * @param message Message to log
     * @param event Optional event declaration for improved log filtering
     */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static error(message: string, context?: any){
    Logger.customLogMessage(LogLevel.ERROR, message, context);
  }

  /**
     * Creates a log message, inserts it into the logger history and updates the Logger component
     * @param level Level of the log message
     * @param message The message to log
     * @param context Optional context for the log message, e.g. an error object.
     */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static customLogMessage(level: LogLevel, message: string, context?: any){
        
    const newMessage: LogMessage = {
      date: new Date(),
      level: level,
      message: context ? message + JSON.stringify(context) : message,
    };

    const newMessageHistory : LogMessage[] = [newMessage, ...Logger.logMessages];
    Logger.logMessages = newMessageHistory;

    Logger.updateComponent(newMessageHistory);
    console.log(level + ": " + message, context);
  }

  private static updateComponent(messages: LogMessage[]){
    // Only log if logging component is ready
    if(Logger.loggerReferenceSetter)
      Logger.loggerReferenceSetter(messages);
  }

  static overrideComponentMessageSetterRef(setter: Dispatch<SetStateAction<LogMessage[]>>){
    Logger.loggerReferenceSetter = setter;
    Logger.info("Updating logger component setter");
  }
}
