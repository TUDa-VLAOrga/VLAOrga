package de.vlaorgatu.vlabackend.services;

import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentSeries;
import de.vlaorgatu.vlabackend.entities.vladb.ExperimentBooking;
import de.vlaorgatu.vlabackend.entities.vladb.Lecture;
import de.vlaorgatu.vlabackend.exceptions.InvalidRequestInCurrentServerState;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.ExperimentBookingRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class ExperimentBookingService {
    private final ExperimentBookingRepository experimentBookingRepository;

    private final AppointmentRepository appointmentRepository;

    public void moveExperimentBookingsBeforeAppointmentDeletion(
        Appointment toDeleteAppointment
    ) {
        // Check if experimentBookings can be moved, abort if not possible
        List<ExperimentBooking> currentAppointmentExperimentBookings =
            experimentBookingRepository.findExperimentBookingsByAppointment(toDeleteAppointment);

        if (currentAppointmentExperimentBookings.isEmpty()) {
            // Nothing to do when there are no experimentBookings
            return;
        }

        Lecture appointmentLecture = toDeleteAppointment.getSeries().getLecture();

        if (appointmentLecture == null) {
            moveExperimentBookingsOnAppointmentWithoutLecture(
                toDeleteAppointment,
                currentAppointmentExperimentBookings
            );
            return;
        }

        moveExperimentBookingsOnAppointmentWithLecture(
            toDeleteAppointment,
            currentAppointmentExperimentBookings
        );

        /**
         * Wenn es eine lecture gibt: Das zeitlich nächste Event unter allen Events aller Serien der lecture
         * Wenn es keine lecture gibt, aber eine Serie: Das zeitlich nächste Event dieser Serie
         * wenn es weder lecture noch Serie gibt: Verschieben (nach vorne) unmöglich (-> Löschen des Appointments unmöglich, vorher müssen ExperimentBookings gelöscht werden.)
         */

    }

    private void moveExperimentBookingsOnAppointmentWithoutLecture(
        Appointment toDeleteAppointment,
        List<ExperimentBooking> currentAppointmentExperimentBookings
    ) {
        // If there is no lecture, move event to next in series
        final List<Appointment> appointmentsInSeries =
            toDeleteAppointment.getSeries().getAppointments();

        final LocalDateTime appointmentEnd = toDeleteAppointment.getEndTime();

        Appointment nextAppointment = appointmentsInSeries.getFirst();

        // We can not be sure that appointments are stored in sorted order
        for (Appointment candidateAppointment : appointmentsInSeries) {
            final boolean validAppointment =
                appointmentEnd.isBefore(candidateAppointment.getStartTime());

            final boolean earliestAppointmentYet =
                candidateAppointment.getStartTime().isBefore(nextAppointment.getStartTime());

            if (validAppointment && earliestAppointmentYet) {
                nextAppointment = candidateAppointment;
            }
        }

        // Best-fit appointment is now chosen
        // Check if it really meets the criteria or was just never updated

        final boolean validAppointment =
            appointmentEnd.isBefore(nextAppointment.getStartTime());

        nextAppointment = validAppointment ? nextAppointment : null;

        if (nextAppointment == null) {
            moveExperimentBookingNotPossible();
            // For readability
            return;
        }

        // Valid appointment was found in series
        // Update experimentBookings
        List<ExperimentBooking> movedExperimentBookings = new ArrayList<>();
        for (ExperimentBooking experimentBooking : currentAppointmentExperimentBookings) {
            experimentBooking.setAppointment(nextAppointment);
            movedExperimentBookings.add(experimentBooking);
        }

        // Successfully moved experimentBookings
        experimentBookingRepository.saveAll(movedExperimentBookings);
    }

    private void moveExperimentBookingsOnAppointmentWithLecture(
        Appointment toBeDeletedAppointment,
        List<ExperimentBooking> currentAppointmentExperimentBookings
    ) {
        final AppointmentSeries appointmentSeries = toBeDeletedAppointment.getSeries();

        final Optional<Appointment> potentialNextAppointment =
            appointmentRepository.getAppointmentBySeriesAndStartTimeIsAfterOrderByStartTime(
                appointmentSeries,
                toBeDeletedAppointment.getEndTime()
            );

        if (potentialNextAppointment.isEmpty()) {
            moveExperimentBookingNotPossible();
            // For readability
            return;
        }

        Appointment nextAppointment = potentialNextAppointment.get();

        List<ExperimentBooking> movedExperimentBookings = new ArrayList<>();
        for (ExperimentBooking experimentBooking : currentAppointmentExperimentBookings) {
            experimentBooking.setAppointment(nextAppointment);
            movedExperimentBookings.add(experimentBooking);
        }

        // Successfully moved experimentBookings
        experimentBookingRepository.saveAll(movedExperimentBookings);
    }

    private void moveExperimentBookingNotPossible() {
        throw new InvalidRequestInCurrentServerState(
            "Experimentbookings could not be moved automatically to next appointment " +
                "as there is no next appointment in series."
        );
    }
}
