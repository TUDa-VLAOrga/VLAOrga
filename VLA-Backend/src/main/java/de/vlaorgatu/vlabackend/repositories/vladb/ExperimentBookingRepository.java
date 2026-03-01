package de.vlaorgatu.vlabackend.repositories.vladb;

import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
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
     * Method for returning all {@link ExperimentBooking} bound to a {@link Appointment}.
     *
     * @param appointment The appointment to search for
     * @return All {@link ExperimentBooking}s that are assigned to the appointment
     */
    List<ExperimentBooking> findExperimentBookingsByAppointment(Appointment appointment);
}
