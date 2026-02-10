package de.vlaorgatu.vlabackend.entities.calendar.experimentbooking;

import de.vlaorgatu.vlabackend.entities.calendar.appointment.Appointment;
import de.vlaorgatu.vlabackend.entities.calendar.person.Person;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
    private Long linusExperimentId;

    /**
     * ID of this booking in linus.
     */
    @Column(name = "linus_reservation_id")
    private Long linusExperimentBookingId;

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
}
