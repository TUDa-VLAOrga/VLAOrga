package de.vlaorgatu.vlabackend.sse;

/**
 * Enumeration for MessageEvents that are sent to the frontend.
 * Make sure that this list is always up-to-date!
 */
public class SseMessage {
    public static final String DEBUG = "DEBUG";
    public static final String EXPERIMENT = "experiment";
    public static final String CALENDAR = "calendar";
    public static final String APPROVEDELETION = "approveDeletion";
}