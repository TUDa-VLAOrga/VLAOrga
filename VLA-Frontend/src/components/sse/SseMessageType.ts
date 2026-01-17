/**
 * Enumeration for MessageEvents that may be sent by the backend
 * Make sure that this list is always up-to-date!
 */
export enum SseMessageType {
  DEBUG = "DEBUG",
  EXPERIMENT = "experiment",
  CALENDAR = "calendar",
  APPROVEDELETION = "approveDeletion",
};
