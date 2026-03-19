package de.vlaorgatu.vlabackend.repositories.vladb;

import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
import de.vlaorgatu.vlabackend.entities.vladb.Lecture;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for accessing and managing {@link Appointment} entities.
 */
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    /**
     * Searches for next appointment in a series with lectures.
     *
     * @param seriesLectureId The id of the lecture
     * @param startTime       The lower exclusive time bound for start of event.
     * @return The first appointment that is for the same lecture and starts after startTime
     */
    @SuppressWarnings("checkstyle:indentation")
    Optional<Appointment>
    findFirstAppointmentBySeriesLectureIdAndStartTimeGreaterThanOrderByStartTimeAsc(
        Long seriesLectureId,
        LocalDateTime startTime
    );

    /**
     * Searches for the next appointment in a series.
     *
     * @param seriesId  The id of the series to search in
     * @param startTime The lower exclusive time bound for start of event.
     * @return Appointment in the specified series that starts after the startTime
     */
    @SuppressWarnings("checkstyle:indentation")
    Optional<Appointment>
    findFirstAppointmentBySeriesIdAndStartTimeGreaterThanOrderByStartTimeAsc(
        Long seriesId,
        LocalDateTime startTime
    );

    /**
     * Finds the last event in a series without a lecture that ends before the endtime.
     *
     * @param seriesLectureId The id of the series of the lecture the appointments belong to.
     * @param endTime         The exclusive upper bound for the end of events.
     * @return Previous appointment in series without lecture
     */
    Optional<Appointment> findFirstAppointmentBySeriesIdAndEndTimeLessThanOrderByEndTimeDesc(
        Long seriesLectureId,
        LocalDateTime endTime
    );

    /**
     * Finds the last event in a series with a lecture that ends before the endtime.
     *
     * @param seriesLectureId The id of the series of the lecture the appointments belong to.
     * @param endTime         The exclusive upper bound for the end of events.
     * @return Previous appointment in series with lecture
     */
    Optional<Appointment> findFirstAppointmentBySeriesLectureIdAndEndTimeLessThanOrderByEndTimeDesc(
        Long seriesLectureId,
        LocalDateTime endTime
    );

    /**
     * Finds an appointment by its id.
     *
     * @param id The id of the appointment
     * @return The Appointment if existent
     */
    Optional<Appointment> getAppointmentById(Long id);

    /**
     * Finds all appointments that begin before a start time and end after an end time.
     * Borders are inclusive.
     *
     * @param start The start of the event
     * @param end   The end of the event
     * @return All appointments that contain this event
     */
    List<Appointment> findAppointmentsByStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
        LocalDateTime start,
        LocalDateTime end
    );

    /**
     * Finds all appointments belonging to a lecture.
     *
     * @param seriesLecture The lecture
     * @return All appointments that have this lecture
     */
    List<Appointment> findAppointmentsBySeriesLecture(Lecture seriesLecture);

    /**
     * Finds all {@link Appointment} during a time span.
     *
     * @param start The inclusive lower bound of the time frame
     * @param end   The inclusive upper bound of the time frame
     * @return All appointments during a time span (inclusive bounds)
     */
    List<Appointment> findAppointmentsByStartTimeGreaterThanEqualAndEndTimeLessThanEqual(
        LocalDateTime start,
        LocalDateTime end
    );
}
