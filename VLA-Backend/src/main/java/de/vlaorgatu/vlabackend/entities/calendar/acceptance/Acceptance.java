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
 * Represents an acceptance of an appointment.
 * <br>
 * This is the points where the lecturers check prepared experiments.
 */
@Data
@Entity
@Table(name = "acceptances")
public class Acceptance {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Appointment appointment;

    @Column(name = "start")
    private LocalDateTime start;

    @Column(name = "end")
    private LocalDateTime end;
}

