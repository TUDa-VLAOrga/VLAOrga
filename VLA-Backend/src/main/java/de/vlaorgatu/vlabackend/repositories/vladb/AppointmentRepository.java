package de.vlaorgatu.vlabackend.repositories.vladb;

import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentSeries;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for accessing and managing {@link Appointment} entities.
 */
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    /**
     * Gets the first appointment in a series that is after the startTime.
     *
     * @param series    The {@link AppointmentSeries} the appointment belongs to
     * @param startTime The time the appointment should start after
     * @return An appointment, if exists, matching the criteria
     */
    Optional<Appointment> getAppointmentBySeriesAndStartTimeIsAfterOrderByStartTime(
        AppointmentSeries series, LocalDateTime startTime);
}
