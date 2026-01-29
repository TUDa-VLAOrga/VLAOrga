package de.vlaorgatu.vlabackend.linus_connection;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for accessing and managing {@link LinusAppointment} entities.
 */
public interface LinusAppointmentRepository extends JpaRepository<LinusAppointment,Long> {
}
