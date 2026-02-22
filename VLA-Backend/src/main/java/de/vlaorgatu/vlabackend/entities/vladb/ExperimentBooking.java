package de.vlaorgatu.vlabackend.entities.vladb;

import com.fasterxml.jackson.annotation.JsonBackReference;
import de.vlaorgatu.vlabackend.enums.calendar.experimentbooking.ExperimentPreparationStatus;
import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Represents a booked experiment for a certain appointment.
 */
@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
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
    @Column(name = "linus_experiment_id", nullable = false)
    private Integer linusExperimentId;  // Integer instead of int to allow nullability

    /**
     * ID of this booking in linus.
     */
    @Column(name = "linus_reservation_id")
    @Nullable
    private Integer linusExperimentBookingId;  // Integer instead of int to allow nullability

    /**
     * Person who booked the experiment.
     */
    @ManyToOne
    @Nullable
    private Person person;

    /**
     * Appointment this experiment is booked for.
     */
    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    /**
     * Notes for this booking, probably taken from linus reservation at init.
     */
    @Column(name = "notes", nullable = false, length = 4096)
    private String notes = "";

    /**
     * Preparation status of the experiment.
     */
    @Column(name = "status", nullable = false)
    private ExperimentPreparationStatus status = ExperimentPreparationStatus.PENDING;
}
