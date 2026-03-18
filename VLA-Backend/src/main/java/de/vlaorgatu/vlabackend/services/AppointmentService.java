package de.vlaorgatu.vlabackend.services;

import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
import de.vlaorgatu.vlabackend.exceptions.InvalidRequestInCurrentServerState;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Class for supplementing operations on {@link Appointment}s.
 */
@AllArgsConstructor
@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;

    /**
     * Finds the next appointment that starts after the start of the specified appointment.
     *
     * @param source The appointment to search from; Should not belong to a series with a lecture.
     * @return The next appointment
     */
    private Appointment findNextAppointmentInSeriesWithoutLecture(Appointment source) {
        return appointmentRepository
            .findFirstAppointmentBySeriesIdAndStartTimeGreaterThanOrderByStartTimeAsc(
                source.getSeries().getId(),
                source.getStartTime())
            .orElseThrow(() -> new InvalidRequestInCurrentServerState(
                "No next appointment in series to move experimentBooking to"
            ));
    }

    /**
     * Finds the next appointment that starts after the start of the specified appointment.
     *
     * @param source The appointment to search from; Should belong to a series with a lecture.
     * @return The next appointment
     */
    private Appointment findNextAppointmentInSeriesWithLecture(Appointment source) {
        return appointmentRepository
            .findFirstAppointmentBySeriesLectureIdAndStartTimeGreaterThanOrderByStartTimeAsc(
                // Always exists per precondition
                source.getSeries().getLecture().getId(),
                source.getStartTime())
            .orElseThrow(() -> new InvalidRequestInCurrentServerState(
                "No next appointment in lecture to move experimentBooking to"
            ));
    }

    /**
     * Finds the previous appointment that starts ends before the end of the specified appointment.
     *
     * @param source The appointment to search from; Should not belong to a series with a lecture.
     * @return The previous appointment
     */
    private Appointment findPreviousAppointmentInSeriesWithoutLecture(Appointment source) {
        return appointmentRepository
            .findFirstAppointmentBySeriesIdAndEndTimeLessThanOrderByEndTimeDesc(
                source.getSeries().getId(),
                source.getEndTime())
            .orElseThrow(() -> new InvalidRequestInCurrentServerState(
                "No previous appointment in series to move experimentBooking to"
            ));
    }

    /**
     * Finds the previous appointment that ends before the end of the specified appointment.
     *
     * @param source The appointment to search from; Should belong to a series with a lecture.
     * @return The previous appointment
     */
    private Appointment findPreviousAppointmentInSeriesWithLecture(Appointment source) {
        return appointmentRepository
            .findFirstAppointmentBySeriesLectureIdAndEndTimeLessThanOrderByEndTimeDesc(
                // Always exists per precondition
                source.getSeries().getLecture().getId(),
                source.getEndTime())
            .orElseThrow(() -> new InvalidRequestInCurrentServerState(
                "No previous appointment in lecture to move experimentBooking to"
            ));
    }

    /**
     * Finds the next appointment in a series that starts after the source appointment starts.
     *
     * @param source The appointment to search from
     * @return The next appointment
     */
    public Appointment findNextAppointment(Appointment source) {
        if (source.getSeries().getLecture() != null) {
            return findNextAppointmentInSeriesWithLecture(source);
        } else {
            return findNextAppointmentInSeriesWithoutLecture(source);
        }
    }

    /**
     * Finds the previous appointment in a series that ends before the source appointment ends.
     *
     * @param source The appointment to search from
     * @return The next appointment
     */
    public Appointment findPreviousAppointment(Appointment source) {
        if (source.getSeries().getLecture() != null) {
            return findPreviousAppointmentInSeriesWithLecture(source);
        } else {
            return findPreviousAppointmentInSeriesWithoutLecture(source);
        }
    }
}
