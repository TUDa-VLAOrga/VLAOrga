package de.vlaorgatu.vlabackend.services;

import de.vlaorgatu.vlabackend.controller.sse.SseController;
import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentSeries;
import de.vlaorgatu.vlabackend.entities.vladb.ExperimentBooking;
import de.vlaorgatu.vlabackend.entities.vladb.Lecture;
import de.vlaorgatu.vlabackend.enums.sse.SseMessageType;
import de.vlaorgatu.vlabackend.exceptions.InvalidRequestInCurrentServerState;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.ExperimentBookingRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

/**
 * Class for executing operations on {@link ExperimentBooking}s.
 */
@AllArgsConstructor
@Service
public class ExperimentBookingService {
    /**
     * Repository of {@link ExperimentBooking}s entities.
     */
    private final ExperimentBookingRepository experimentBookingRepository;

    /**
     * Repository of {@link Appointment}s entities.
     */
    private final AppointmentRepository appointmentRepository;

    /**
     * Moves experiments (if possible) to another appointment when an appointment should be deleted.
     *
     * @param toDeleteAppointment The appointment to delete
     */
    public void moveExperimentBookingsBeforeAppointmentDeletion(
        Appointment toDeleteAppointment
    ) {
        // Check if experimentBookings can be moved, abort if not possible
        List<ExperimentBooking> currentAppointmentExperimentBookings =
            toDeleteAppointment.getBookings();

        if (currentAppointmentExperimentBookings.isEmpty()) {
            // Nothing to do when there are no experimentBookings
            return;
        }

        Lecture appointmentLecture = toDeleteAppointment.getSeries().getLecture();

        Appointment nextAppointment = getNextValidExperimentBookingAppointmentFromSeries(
            toDeleteAppointment
        );

        moveExperimentBookings(toDeleteAppointment, nextAppointment);
    }

    public Appointment getNextValidExperimentBookingAppointmentFromSeries(Appointment previous) {
        Lecture appointmentLecture = previous.getSeries().getLecture();

        if (appointmentLecture == null) {
            // Appointment has no lecture
            return appointmentRepository
                .findAppointmentBySeriesIdAndStartTimeGreaterThanOrderByStartTimeAsc(
                    previous.getId(),
                    previous.getStartTime()
                )
                .orElseThrow(
                    () -> new InvalidRequestInCurrentServerState(
                        "Experimentbookings could not be moved automatically to next appointment " +
                            "as there is no next appointment in series."
                    )
                );
        } else {
            // Appointment has lecture
            return appointmentRepository
                .findAppointmentBySeriesLectureIdAndStartTimeGreaterThanOrderByStartTimeAsc(
                    appointmentLecture.getId(),
                    previous.getStartTime()
                )
                .orElseThrow(
                    () -> new InvalidRequestInCurrentServerState(
                        "Experimentbookings could not be moved automatically to next appointment " +
                            "as there is no next appointment in series."
                    )
                );
        }
    }

    public synchronized void moveExperimentBookings(Appointment source, Appointment target) {
        List<ExperimentBooking> bookingsToMove = source.getBookings();

        for (ExperimentBooking booking : bookingsToMove) {
            booking.setAppointment(target);
        }

        List<ExperimentBooking> targetBookings = target.getBookings();
        targetBookings.addAll(bookingsToMove);

        source.setBookings(new ArrayList<>());
        target.setBookings(targetBookings);

        List<ExperimentBooking> savedBookings = experimentBookingRepository.saveAll(bookingsToMove);
        source = appointmentRepository.save(source);
        target = appointmentRepository.save(target);

        SseController.notifyAllOfObject(SseMessageType.APPOINTMENTUPDATED, source);
        SseController.notifyAllOfObject(SseMessageType.APPOINTMENTUPDATED, target);
    }
}
