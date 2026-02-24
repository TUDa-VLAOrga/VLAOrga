package de.vlaorgatu.vlabackend.repositories.vladb;

import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
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
}
