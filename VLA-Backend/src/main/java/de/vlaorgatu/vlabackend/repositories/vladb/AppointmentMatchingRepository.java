package de.vlaorgatu.vlabackend.repositories.vladb;

import de.vlaorgatu.vlabackend.entities.vladb.AppointmentMatching;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentMatchingRepository extends
    JpaRepository<AppointmentMatching, Long> {

    List<Integer> findAppointmentMatchingsByAppointmentNull();

    Optional<AppointmentMatching> findAppointmentMatchingsByLinusAppointmentId(
        Integer linusAppointmentId);
}
