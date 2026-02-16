package de.vlaorgatu.vlabackend.entities.calendar.experimentbooking;

import de.vlaorgatu.vlabackend.linusconnection.LinusExperimentBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for accessing and managing {@link ExperimentBooking} entities.
 */
@Repository
public interface ExperimentBookingRepository extends JpaRepository<ExperimentBooking, Long> {
    List<ExperimentBooking> findExperimentBookingsByLinusExperimentBookingId(Integer linusExperimentBookingId);
}
