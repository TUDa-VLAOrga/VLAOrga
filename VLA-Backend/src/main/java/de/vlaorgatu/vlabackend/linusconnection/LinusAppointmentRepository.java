package de.vlaorgatu.vlabackend.linusconnection;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for accessing and managing {@link LinusAppointment} entities.
 */
public interface LinusAppointmentRepository extends JpaRepository<LinusAppointment, Long> {
}
