/**
 * Enumeration for MessageEvents strings that may be sent by the backend
 * Make sure that this list is always up-to-date!
 * 
 * "message", "open", "close" may not be used 
 */
export enum SseMessageType {
  DEBUG = "DEBUG",
  SSEDEBUG = "SSEDEBUG",
  EXPERIMENT = "experiment",
  CALENDAR = "calendar",
  APPROVEDELETION = "approveDeletion",
};
