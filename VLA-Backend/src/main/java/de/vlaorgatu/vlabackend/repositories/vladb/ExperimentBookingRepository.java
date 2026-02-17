package de.vlaorgatu.vlabackend.repositories.vladb;

import de.vlaorgatu.vlabackend.entities.vladb.ExperimentBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for accessing and managing {@link ExperimentBooking} entities.
 */
@Repository
public interface ExperimentBookingRepository extends JpaRepository<ExperimentBooking, Long> {
    List<ExperimentBooking> findByLinusExperimentBookingId(Integer linusExperimentBookingId);
}
