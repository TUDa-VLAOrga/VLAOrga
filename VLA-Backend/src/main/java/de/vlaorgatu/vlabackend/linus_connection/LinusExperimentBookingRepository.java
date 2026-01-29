package de.vlaorgatu.vlabackend.linus_connection;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for accessing and managing {@link LinusExperimentBooking} entities.
 */
public interface LinusExperimentBookingRepository extends JpaRepository<LinusExperimentBooking,Long> {
}
