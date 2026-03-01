package de.vlaorgatu.vlabackend.entities.vladb;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Represents an appointment in our calendar.
 */
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
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
    @JsonBackReference
    private AppointmentSeries series;

    /**
     * Start time of the appointment.
     */
    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    /**
     * End time of the appointment.
     */
    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    /**
     * Notes for this appointment.
     */
    @Column(name = "notes", nullable = false)
    private String notes = "";

    /**
     * The id of a {@link User} that intents on deleting this appointment.
     */
    @Nullable
    @ManyToOne // We avoid the @ManyToMany as we only need 2 approvals
    @JsonManagedReference
    private User deletingIntentionUser;
}
