package de.vlaorgatu.vlabackend.entities.vladb;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a booked experiment for a certain appointment.
 */
@Builder
@AllArgsConstructor
@NoArgsConstructor
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
     * ID of the booked-for appointment
     */
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    @JsonBackReference
    @JsonIgnore
    private Appointment appointment;

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
     * Notes for this booking, probably taken from linus reservation at init.
     */
    @Column(name = "notes", nullable = false)
    private String notes = "";

    /**
     * Preparation status of the experiment.
     */
    @Column(name = "status", nullable = false)
    private ExperimentPreparationStatus status = ExperimentPreparationStatus.PENDING;

    /**
     * Person who booked the experiment.
     */
    @ManyToOne
    @Nullable
    private Person person;
}
