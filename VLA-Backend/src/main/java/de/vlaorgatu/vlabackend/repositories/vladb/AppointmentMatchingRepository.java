package de.vlaorgatu.vlabackend.repositories.vladb;

import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentMatching;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for accessing and managing {@link AppointmentMatching} entities.
 */
public interface AppointmentMatchingRepository extends
    JpaRepository<AppointmentMatching, Long> {

    /**
     * Returns all {@link AppointmentMatching}s without a proper match to {@link Appointment}.
     * This could e.g. be used for retrieving linus reservations that are not matched yet.
     *
     * @return A list of {@link AppointmentMatching}s without an associated {@link Appointment}
     */
    List<AppointmentMatching> findAppointmentMatchingsByAppointmentNull();

    /**
     * Retrieves the {@link AppointmentMatching}s for a linusAppointment based on the id.
     *
     * @param linusAppointmentId The id of the linus reservation
     * @return {@link AppointmentMatching} for the linus reservation if existent
     */
    Optional<AppointmentMatching> findAppointmentMatchingsByLinusAppointmentId(
        Integer linusAppointmentId);

    /**
     * Returns all {@link AppointmentMatching} in a given time frame.
     *
     * @param start Inclusive start of the date
     * @param end Inclusive end of the date
     * @return All {@link AppointmentMatching} in the time frame
     */
    List<AppointmentMatching> getAppointmentMatchingsBylinusAppointmentTimeBetween(
        LocalDateTime start,
        LocalDateTime end
    );
}
