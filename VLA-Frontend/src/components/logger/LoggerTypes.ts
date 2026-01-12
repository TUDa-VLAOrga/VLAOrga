/**
 * Symbolizes the category of the log
 */
export enum LogLevel {
    INFO = "Info",
    WARN = "Warn",
    ERROR = "Error",
}

/**
 * This will be dynamically expanded upon and can be used to
 * make the logging filter more granular.
 */
export enum LogEvent {
    SseRelated,
}

/**
 * Defines the structure of a log message
 */
export type LogMessage = {
    date: Date,
    level : LogLevel,
    message : string,
    eventType? : LogEvent, 
}
