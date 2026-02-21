package de.vlaorgatu.vlabackend.enums.sse;

import de.vlaorgatu.vlabackend.entities.vladb.GlobalNote;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Enumeration for MessageEvents that are sent to the frontend.
 * Make sure that this list is always up-to-date!
 */
@Getter
@AllArgsConstructor
public enum SseMessageType {
    /**
     * Used for sending Debug messages to the frontend for SSE.
     */
    SSEDEBUG("SSEDEBUG"),
    /**
     * Used for sending SSE Events after a {@link GlobalNote} has been created.
     */
    GLOBALNOTECREATED("GLOBALNOTECREATED"),
    /**
     * Used for sending SSE Events after a {@link GlobalNote} has been updated.
     */
    GLOBALNOTEUPDATED("GLOBALNOTEUPDATED"),
    /**
     * Used for sending SSE Events after a {@link GlobalNote} has been updated.
     */
    GLOBALNOTEDELETED("GLOBALNOTEDELETED"),
    /**
     * Used for sending SSE Events after a {@link AppointmentRepository} has been updated.
     * This update contains all created appointments imported from linus.
     * TODO: Frontend handling
     */
    LINUSAPPOINTMENTIMPORT("LINUSAPPOINTMENTIMPORT"),
    /**
     * Used for sending Debug messages to the frontend.
     */
    DEBUG("DEBUG");

    /**
     * The actual value of the enum object.
     */
    private final String value;
}
