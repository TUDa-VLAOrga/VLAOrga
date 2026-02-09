package de.vlaorgatu.vlabackend.entities.calendar.appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for accessing and managing {@link Appointment} entities.
 */
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
}
