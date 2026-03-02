/**
 * Symbolizes the category of the log
 */
export enum LogLevel {
  INFO = "Info",
  WARN = "Warn",
  ERROR = "Error",
}

/**
 * Defines the structure of a log message
 */
export type LogMessage = {
  date: Date,
  level : LogLevel,
  message : string,
};
