package de.vlaorgatu.vlabackend.entities.vladb;

import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
     * The list of linus reservation ids an appointment is matched to
     */
    @Column(name = "linus_appointment_id", nullable = false)
    private Integer linusAppointmentIds;

    @Nullable
    @OneToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;
}
