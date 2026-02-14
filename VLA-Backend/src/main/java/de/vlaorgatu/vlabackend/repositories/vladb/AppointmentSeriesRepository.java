package de.vlaorgatu.vlabackend.repositories.vladb;

import de.vlaorgatu.vlabackend.entities.vladb.AppointmentSeries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for accessing and managing {@link AppointmentSeries} entities.
 */
@Repository
public interface AppointmentSeriesRepository extends JpaRepository<AppointmentSeries, Long> {
}
