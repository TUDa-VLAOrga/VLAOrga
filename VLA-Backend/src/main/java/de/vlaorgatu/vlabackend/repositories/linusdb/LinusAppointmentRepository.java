package de.vlaorgatu.vlabackend.repositories.linusdb;

import de.vlaorgatu.vlabackend.entities.linusdb.LinusAppointment;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for accessing and managing {@link LinusAppointment} entities.
 */
public interface LinusAppointmentRepository extends ReadOnlyRepository<LinusAppointment, Long> {
    List<LinusAppointment> findByAppointmentTimeBetween(LocalDateTime start,
                                                        LocalDateTime end);
}
