package de.vlaorgatu.vlabackend.linus_connection;

import jakarta.persistence.*;
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
     * linus appointment id
     */
    @Column(name = "reservation_id")
    private Long linusAppointmentId;

    /**
     * linus experiment id
     */
    @Column(name = "experiment_id")
    private Long linusExperimentId;

    /**
     * linus user id
     */
    @Column(name = "user_id")
    private Long linusUserId;

    /**
     * status of the booking
     */
    @Column(name = "status")
    private Long status;

    /**
     * todo
     * time of the booking?
     */
    @Column(name = "pinned_on")
    private String pinnedOn;
}
