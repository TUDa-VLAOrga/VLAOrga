package de.vlaorgatu.vlabackend.repositories.linusdb;

import de.vlaorgatu.vlabackend.entities.linusdb.LinusAppointment;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for accessing and managing {@link LinusAppointment} entities.
 */
public interface LinusAppointmentRepository extends ReadOnlyRepository<LinusAppointment, Long> {
    /**
     * Searches for all linus reservations in a given time frame.
     *
     * @param start The start of the time frame
     * @param end   The end of the time frame
     * @return All {@link LinusAppointment}s in this time frame
     */
    List<LinusAppointment> findByAppointmentTimeBetween(LocalDateTime start,
                                                        LocalDateTime end);
}
