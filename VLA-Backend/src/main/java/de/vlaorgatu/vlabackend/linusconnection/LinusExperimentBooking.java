package de.vlaorgatu.vlabackend.linusconnection;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;

/**
 * Represents that an experiment is booked for an appointment.
 */
@Getter
@Entity
// table and column names are taken from https://git.rwth-aachen.de/datenbank-physik/datenbank-physik/-/blob/master/src/Entity/ReservationExperiment.php
// Integer is used for nullable columns and int for non-null ones.
@Table(name = "reservation_experiment")
public class LinusExperimentBooking {
    @Id
    private int id;

    /**
     * Linus appointment id.
     */
    // TODO: possible candidate for @JoinColumn
    @Column(name = "reservation_id")
    private Integer linusAppointmentId;

    /**
     * Linus experiment id.
     */
    // TODO: possible candidate for @JoinColumn
    @Column(name = "experiment_id")
    private int linusExperimentId;

    /**
     * Linus user id.
     */
    // TODO: possible candidate for @JoinColumn
    @Column(name = "user_id")
    private int linusUserId;

    /**
     * Status of the booking.
     */
    @Column(name = "status", nullable = false)
    private Integer status;

    /**
     * Time of the booking.
     */
    @Column(name = "pinned_on")
    private LocalDateTime pinnedOn;
}
