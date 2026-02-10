package de.vlaorgatu.vlabackend.entities.calendar.acceptance;

import de.vlaorgatu.vlabackend.entities.calendar.appointment.Appointment;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Data;

/**
 * Represents an acceptance meeting of an appointment.
 * <br>
 * This is the point where the lecturers check prepared experiments.
 */
@Data
@Entity
@Table(name = "acceptances")
public class Acceptance {

    /**
     * Primary key.
     */
    @Id
    @GeneratedValue
    private Long id;

    /**
     * Appointment this acceptance belongs to.
     */
    @ManyToOne
    private Appointment appointment;

    /**
     * Start time of the acceptance.
     */
    @Column(name = "start")
    private LocalDateTime start;

    /**
     * End time of the acceptance.
     */
    @Column(name = "end")
    private LocalDateTime end;
}

