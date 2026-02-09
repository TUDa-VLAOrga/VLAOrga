package de.vlaorgatu.vlabackend.linusconnection;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for accessing and managing {@link LinusExperimentBooking} entities.
 */
public interface LinusExperimentBookingRepository
        extends JpaRepository<LinusExperimentBooking, Long> {
}
