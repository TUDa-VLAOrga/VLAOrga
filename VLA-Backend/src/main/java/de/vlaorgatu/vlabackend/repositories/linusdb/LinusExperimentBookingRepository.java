package de.vlaorgatu.vlabackend.repositories.linusdb;

import de.vlaorgatu.vlabackend.entities.linusdb.LinusAppointment;
import de.vlaorgatu.vlabackend.entities.linusdb.LinusExperimentBooking;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for accessing and managing {@link LinusExperimentBooking} entities.
 */
public interface LinusExperimentBookingRepository
    extends ReadOnlyRepository<LinusExperimentBooking, Long> {
    List<LinusExperimentBooking> findByLinusAppointmentId(Integer linusAppointmentId);
}
