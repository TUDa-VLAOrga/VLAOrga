package de.vlaorgatu.vlabackend.enums.sse;

import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
import de.vlaorgatu.vlabackend.entities.vladb.ExperimentBooking;
import de.vlaorgatu.vlabackend.entities.vladb.GlobalNote;
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
     * Used for sending SSE Events after a {@link ExperimentBooking} has been updated.
     */
    EXPERIMENTBOOKINGUPDATED("EXPERIMENTBOOKINGUPDATED"),
    /**
     * Used for sending SSE Events after a {@link Appointment} has been created.
     */
    APPOINTMENTCREATED("APPOINTMENTCREATED"),
    /**
     * Used for sending SSE Events after a {@link Appointment} has been updated.
     */
    APPOINTMENTUPDATED("APPOINTMENTUPDATED"),
    /**
     * Used for sending SSE Events after a {@link Appointment} has been deleted.
     */
    APPOINTMENTDELETED("APPOINTMENTDELETED"),
    /**
     * Used for sending Debug messages to the frontend.
     */
    DEBUG("DEBUG");

    /**
     * The actual value of the enum object.
     */
    private final String value;
}
