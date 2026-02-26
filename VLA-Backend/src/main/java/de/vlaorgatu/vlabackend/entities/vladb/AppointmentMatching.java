package de.vlaorgatu.vlabackend.entities.vladb;

import com.fasterxml.jackson.annotation.JsonFormat;
import de.vlaorgatu.vlabackend.entities.linusdb.LinusAppointment;
import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Class representing a matching of linus reservations and appointments.
 */
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class AppointmentMatching {

    /**
     * The id of the matching.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * The linus reservation id this matching represents.
     */
    @Column(name = "linus_appointment_id", nullable = false, unique = true)
    private Integer linusAppointmentId;

    /**
     * Duplication from {@link LinusAppointment}, the time an appointment was set to take place.
     * Note: This is for reducing API calls during the matching process
     */
    @Column(name = "linus_appointment_time")
    private LocalDateTime linusAppointmentTime;

    /**
     * The id of {@link Appointment} the linus_appointment is matched to.
     */
    @Nullable
    @OneToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;
}
