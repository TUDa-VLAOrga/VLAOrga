package de.vlaorgatu.vlabackend.services;

import de.vlaorgatu.vlabackend.controller.sse.SseController;
import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
import de.vlaorgatu.vlabackend.entities.vladb.ExperimentBooking;
import de.vlaorgatu.vlabackend.entities.vladb.Lecture;
import de.vlaorgatu.vlabackend.enums.sse.SseMessageType;
import de.vlaorgatu.vlabackend.exceptions.InvalidRequestInCurrentServerState;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.ExperimentBookingRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
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

        Appointment nextAppointment = getNextValidExperimentBookingAppointmentFromSeries(
            toDeleteAppointment
        );

        moveExperimentBookings(toDeleteAppointment, nextAppointment);
    }

    /**
     * Gets the next valid appointment for an experimentBooking.
     * Errors with {@link InvalidRequestInCurrentServerState} if there is no valid appointment.
     *
     * @param previous The appointment to look in the future of
     * @return The next valid appointment if existent
     */
    public Appointment getNextValidExperimentBookingAppointmentFromSeries(Appointment previous) {
        Lecture appointmentLecture = previous.getSeries().getLecture();

        if (appointmentLecture == null) {
            // Appointment has no lecture
            return appointmentRepository
                .findFirstAppointmentBySeriesIdAndStartTimeGreaterThanOrderByStartTimeAsc(
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
                .findFirstAppointmentBySeriesLectureIdAndStartTimeGreaterThanOrderByStartTimeAsc(
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

    /**
     * Moves all {@link ExperimentBooking}s from one {@link Appointment} to another.
     *
     * @param source The source appointment of experimentBookings
     * @param target The target appointment of experimentBookings
     */
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

        for (ExperimentBooking booking : savedBookings) {
            SseController.notifyAllOfObject(SseMessageType.EXPERIMENTBOOKINGUPDATED, booking);
        }
    }

    /**
     * Moves a {@link ExperimentBooking} from a {@link Appointment} to another.
     *
     * @param booking The booking to move
     * @param target  The target appointment of experimentBooking assignment
     */
    public synchronized ExperimentBooking moveExperimentBooking(ExperimentBooking booking,
                                                                Appointment target) {
        if (booking.getAppointment().equals(target)) {
            return booking;
        }

        // Update booking
        Appointment sourceAppointment = booking.getAppointment();
        booking.setAppointment(target);

        // Update target
        List<ExperimentBooking> targetBookings = target.getBookings();
        targetBookings.add(booking);
        target.setBookings(targetBookings);

        // Update source
        sourceAppointment.getBookings().remove(booking);

        booking = experimentBookingRepository.save(booking);
        sourceAppointment = appointmentRepository.save(sourceAppointment);
        target = appointmentRepository.save(target);

        SseController.notifyAllOfObject(SseMessageType.APPOINTMENTUPDATED, sourceAppointment);
        SseController.notifyAllOfObject(SseMessageType.APPOINTMENTUPDATED, target);
        SseController.notifyAllOfObject(SseMessageType.EXPERIMENTBOOKINGUPDATED, booking);

        return booking;
    }
}
