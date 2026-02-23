package de.vlaorgatu.vlabackend.repositories.vladb;

import de.vlaorgatu.vlabackend.entities.vladb.ExperimentBooking;
import java.util.List;
import java.util.Optional;
import javax.swing.text.html.Option;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for accessing and managing {@link ExperimentBooking} entities.
 */
@Repository
public interface ExperimentBookingRepository extends JpaRepository<ExperimentBooking, Long> {
    /**
     * Retrieves the {@link ExperimentBooking} with a given linus id.
     *
     * @param linusExperimentBookingId The id of the referenced {@link ExperimentBooking}
     * @return {@link ExperimentBooking}s with a given id, empty if nonexistent
     */
    Optional<ExperimentBooking> findExperimentBookingByLinusExperimentBookingId(
        Integer linusExperimentBookingId
    );
}
