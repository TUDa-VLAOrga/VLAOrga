package de.vlaorgatu.vlabackend.repositories.vladb;

import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for accessing and managing {@link Appointment} entities.
 */
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    /**
     * Finds an appointment by its id.
     *
     * @param id The id of the appointment
     * @return The Appointment if existent
     */
    Optional<Appointment> getAppointmentById(Long id);

    /**
     * Finds all appointments that begin before a start time and end after an end time.
     *
     * @param start The start of the event
     * @param end   The end of the event
     * @return All appointments that contain this event
     */
    List<Appointment> findAppointmentsByStartBeforeAndEndAfter(LocalDateTime start,
                                                               LocalDateTime end);
}
