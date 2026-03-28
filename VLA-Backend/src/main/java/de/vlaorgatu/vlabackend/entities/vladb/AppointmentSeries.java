package de.vlaorgatu.vlabackend.entities.vladb;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Represents a series of appointments for a certain lecture.
 * <br>
 * Example: Physik 1 WS25/26 Donnerstags (where Physik 1 WS25/26 is a lecture)
 */
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "appointment_series")
public class AppointmentSeries {

    /**
     * Primary key.
     */
    @Id
    @GeneratedValue
    private Long id;

    /**
     * Lecture this series belongs to.
     */
    @ManyToOne
    @Nullable
    @Builder.Default
    private Lecture lecture = null;

    /**
     * Name of this series. Should be empty if an associated lecture exists.
     * Otherwise, for example, "Sommerurlaub Albert"
     */
    @Column(name = "name", nullable = false)
    @Builder.Default
    private String name = "";

    /**
     * Appointment category of this series.
     */
    @ManyToOne(optional = false)
    private AppointmentCategory category;

    /**
     * List of appointments that this series references.
     */
    @OneToMany(mappedBy = "series")
    @JsonIgnore
    @Builder.Default
    private List<Appointment> appointments = new ArrayList<>();
}
