package de.vlaorgatu.vlabackend.repositories.vladb;

import de.vlaorgatu.vlabackend.entities.vladb.ExperimentBooking;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for accessing and managing {@link ExperimentBooking} entities.
 */
@Repository
public interface ExperimentBookingRepository extends JpaRepository<ExperimentBooking, Long> {
    /**
     * Retrieves all {@link ExperimentBooking}s with a given id.
     *
     * @param linusExperimentBookingId The id of the referenced {@link ExperimentBooking}
     * @return {@link ExperimentBooking}s with a given id, empty list if nonexistent
     */
    List<ExperimentBooking> findByLinusExperimentBookingId(Integer linusExperimentBookingId);
}
