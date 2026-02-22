package de.vlaorgatu.vlabackend.repositories.linusdb;

import de.vlaorgatu.vlabackend.entities.linusdb.LinusAppointment;
import de.vlaorgatu.vlabackend.entities.linusdb.LinusExperimentBooking;
import java.util.List;

/**
 * Repository for accessing and managing {@link LinusExperimentBooking} entities.
 */
public interface LinusExperimentBookingRepository
    extends ReadOnlyRepository<LinusExperimentBooking, Long> {
    /**
     * Retrieves all {@link LinusExperimentBooking}s that reference a {@link LinusAppointment}.
     *
     * @param linusAppointmentId The id of the referenced {@link LinusAppointment}
     * @return {@link LinusExperimentBooking}s that reference a {@link LinusAppointment}
     */
    List<LinusExperimentBooking> findByLinusAppointmentId(Integer linusAppointmentId);
}
