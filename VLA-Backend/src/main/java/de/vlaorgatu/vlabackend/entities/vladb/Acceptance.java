package de.vlaorgatu.vlabackend.entities.vladb;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Represents an acceptance meeting of an appointment.
 * <br>
 * This is the point where the lecturers check prepared experiments.
 */
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
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
    @ManyToOne(optional = false)
    private Appointment appointment;

    /**
     * Start time of the acceptance.
     */
    @Column(name = "start", nullable = false)
    private LocalDateTime start;

    /**
     * End time of the acceptance.
     */
    @Column(name = "end", nullable = false)
    private LocalDateTime end;
}

