package de.vlaorgatu.vlabackend.sse;

/**
 * Enumeration for MessageEvents that are sent to the frontend.
 * Make sure that this list is always up-to-date!
 */
public class SseMessageType {
    /**
     * Used for sending Debug messages to the frontend
     */
    public static final String DEBUG = "DEBUG";

    // TODO: Decide on important SseMessageTypes and think of the syncing events in more detail
    public static final String EXPERIMENT = "experiment";
    public static final String CALENDAR = "calendar";
    public static final String APPROVEDELETION = "approveDeletion";
}
