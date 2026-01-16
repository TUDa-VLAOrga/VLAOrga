package de.vlaorgatu.vlabackend.linus_connection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for accessing and managing {@link Appointment} entities.
 */
public interface AppointmentRepository extends JpaRepository<Appointment,Long> {
}
