package de.vlaorgatu.vlabackend.linusconnection;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

/**
 * Represents that an experiment is booked for an appointment.
 */
@Getter
@Entity
@Table(name = "reservation_experiment")
public class LinusExperimentBooking {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * Linus appointment id.
     */
    @Column(name = "reservation_id")
    private Long linusAppointmentId;

    /**
     * Linus experiment id.
     */
    @Column(name = "experiment_id")
    private Long linusExperimentId;

    /**
     * Linus user id.
     */
    @Column(name = "user_id")
    private Long linusUserId;

    /**
     * Status of the booking.
     */
    @Column(name = "status")
    private Long status;

    /**
     * Time of the booking.
     */
    @Column(name = "pinned_on")
    private String pinnedOn;
}
