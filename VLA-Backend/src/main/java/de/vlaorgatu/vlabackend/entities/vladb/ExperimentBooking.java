package de.vlaorgatu.vlabackend.entities.vladb;

import de.vlaorgatu.vlabackend.enums.calendar.experimentbooking.ExperimentPreparationStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Data;

/**
 * Represents a booked experiment for a certain appointment.
 */
@Data
@Entity
@Table(name = "experiment_bookings")
public class ExperimentBooking {
    /**
     * Primary key.
     */
    @Id
    @GeneratedValue
    private Long id;

    /**
     * ID of the booked experiment in Linus.
     */
    @Column(name = "linus_experiment_id")
    private Integer linusExperimentId;  // Integer instead of int to allow nullability

    /**
     * ID of this booking in linus.
     */
    @Column(name = "linus_reservation_id")
    private Integer linusExperimentBookingId;  // Integer instead of int to allow nullability

    /**
     * Person who booked the experiment.
     */
    @ManyToOne
    private Person person;

    /**
     * Appointment this experiment is booked for.
     */
    @ManyToOne
    private Appointment appointment;

    /**
     * Notes for this booking, probably taken from linus reservation at init.
     */
    @Column(name = "notes", nullable = false)
    private String notes = "";

    /**
     * Preparation status of the experiment.
     */
    @Column(name = "status")
    private ExperimentPreparationStatus status = ExperimentPreparationStatus.PENDING;
}
