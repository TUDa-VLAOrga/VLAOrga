package de.vlaorgatu.vlabackend.entities.vladb;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Represents an appointment in our calendar.
 */
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "appointments")
public class Appointment {

    /**
     * Primary key.
     */
    @Id
    @GeneratedValue
    private Long id;

    /**
     * Appointment series this appointment belongs to.
     */
    @ManyToOne(optional = false)
    private AppointmentSeries series;

    /**
     * Start time of the appointment.
     */
    @Column(name = "start_time", nullable = false)
    private LocalDateTime start;

    /**
     * End time of the appointment.
     */
    @Column(name = "end_time", nullable = false)
    private LocalDateTime end;

    /**
     * Notes for this appointment.
     */
    @Column(name = "notes", nullable = false)
    private String notes = "";

    /**
     * List of {@link ExperimentBooking}s of this appointment.
     */
    @JsonManagedReference
    @OneToMany(mappedBy = "appointment")
    private List<ExperimentBooking> bookings = List.of();
}
