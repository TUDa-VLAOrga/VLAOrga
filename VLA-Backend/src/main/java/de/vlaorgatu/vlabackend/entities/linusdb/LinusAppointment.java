package de.vlaorgatu.vlabackend.entities.linusdb;

import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Represents a single appointment.
 */
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Entity
// table and column names are taken from a production SQL dump.
// Integer is used for nullable columns and int for non-null ones.
@Table(name = "reservation")
public class LinusAppointment {
    /**
     * Primary key.
     */
    @Id
    private int id;

    /**
     * Linus user id.
     */
    // TODO: possible candidate for @JoinColumn
    @Column(name = "user_id")
    private int linusUserId;

    /**
     * Date and time when the reservation of the appointment was made in linus.
     */
    @Column(name = "ordertime")
    @Nullable
    private LocalDateTime orderTime;

    // TODO: enum for status?
    /**
     * Status of the appointment.
     */
    @Column(name = "status")
    private int status;

    /**
     * Date and time when the appointment takes place.
     */
    @Column(name = "lecture_date")
    @Nullable
    private LocalDateTime appointmentTime;

    /**
     * Comment from the linus order.
     * TODO: find out what the intended difference between comment and message is.
     */
    @Column(name = "comment")
    @Nullable
    private String comment;

    /**
     * Message from the linus order.
     * TODO: find out what the intended difference between comment and message is.
     */
    @Column(name = "message")
    @Nullable
    private String message;

    /**
     * Name of the person/lecture.
     */
    @Column(name = "name")
    @Nullable
    private String name;

    /**
     * Overridden getter to convert saved UTC time to Eurpe/Berlin timezone.
     * <br/>
     * Actually, we need to return in user's browser timezone, but We do not know that here
     */
    public LocalDateTime getAppointmentTime() {
        if (Objects.isNull(appointmentTime)) {
            return null;
        }

        ZoneId darmstadtZone = ZoneId.of("Europe/Berlin");
        return appointmentTime.atZone(darmstadtZone).toLocalDateTime();
    }
}
