package de.vlaorgatu.vlabackend.databasesync;

import de.vlaorgatu.vlabackend.UtilityFunctions;
import de.vlaorgatu.vlabackend.controller.sse.SseController;
import de.vlaorgatu.vlabackend.entities.linusdb.LinusAppointment;
import de.vlaorgatu.vlabackend.entities.linusdb.LinusExperimentBooking;
import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentMatching;
import de.vlaorgatu.vlabackend.entities.vladb.ExperimentBooking;
import de.vlaorgatu.vlabackend.entities.vladb.Person;
import de.vlaorgatu.vlabackend.enums.calendar.experimentbooking.ExperimentPreparationStatus;
import de.vlaorgatu.vlabackend.enums.sse.SseMessageType;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusAppointmentRepository;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusExperimentBookingRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentMatchingRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.ExperimentBookingRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.PersonRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Service for various syncing mechanisms for linus.
 */
@Service
@AllArgsConstructor
public class Linussyncservice {
    /**
     * Logger for this class.
     */
    private final Logger log = Logger.getLogger(this.getClass().getName());

    // Linus Repositories
    /**
     * Repository containing all {@link LinusAppointment}s.
     */
    private final LinusAppointmentRepository linusAppointmentRepository;

    /**
     * Repository containing all {@link LinusExperimentBooking}s.
     */
    private final LinusExperimentBookingRepository linusExperimentBookingRepository;

    // VLA Repositories
    /**
     * Repository containing all {@link ExperimentBooking}s.
     */
    private final ExperimentBookingRepository experimentBookingRepository;
    /**
     * Repository containing all {@link AppointmentMatching}s.
     */
    private final AppointmentMatchingRepository appointmentMatchingRepository;
    /**
     * Repository containing all {@link Person}s.
     */
    private final PersonRepository personRepository;

    /**
     * Creates {@link AppointmentMatching} objects for each linus reservation in a given time frame.
     *
     * @param start The start of the time frame that should be matched
     * @param end   The end of the time frame that should be matched
     */
    @Transactional
    public void matchAppointments(LocalDateTime start, LocalDateTime end) {
        List<LinusAppointment> linusAppointments =
            linusAppointmentRepository.findByAppointmentTimeBetween(start, end);
        // TODO: Potentially import by order time as well?

        List<AppointmentMatching> toBeSavedAppointmentMatching = new ArrayList<>();

        for (LinusAppointment linusAppointment : linusAppointments) {
            Optional<AppointmentMatching> matching = appointmentMatchingRepository
                .findAppointmentMatchingsByLinusAppointmentId((linusAppointment.getId()));

            if (matching.isPresent()) {
                // Matching already exists for this entry
                continue;
            }

            AppointmentMatching appointmentMatching = AppointmentMatching.builder()
                .id(null)
                .linusAppointmentId(linusAppointment.getId())
                .linusAppointmentTime(linusAppointment.getAppointmentTime())
                .appointment(null)
                .build();

            toBeSavedAppointmentMatching.add(appointmentMatching);
        }

        List<AppointmentMatching> newAppointmentMatchings =
            appointmentMatchingRepository.saveAll(toBeSavedAppointmentMatching);

        SseController.notifyAllOfObject(
            SseMessageType.APPOINTMENTMATCHINGCREATE,
            newAppointmentMatchings
        );

        log.info(
            "Created " + newAppointmentMatchings.size() + " matchings for linus reservations"
        );
    }

    /**
     * Syncs {@link LinusExperimentBooking} to {@link ExperimentBooking} in the given time frame.
     * Synchronisation will only happen if a non-noll matched {@link AppointmentMatching} exists
     * for the {@link LinusAppointment} the {@link LinusExperimentBooking} belongs to.
     *
     * @param start The start of the time frame that should be synced
     * @param end   The end of the time frame that should be synced
     */
    @Transactional
    public void syncMatchedAppointmentsExperimentBookings(LocalDateTime start, LocalDateTime end) {
        List<LinusAppointment> linusAppointments =
            linusAppointmentRepository.findByAppointmentTimeBetween(start, end);

        String logWarnMessage = "";
        int notAssignedExperimentBookings = 0;

        for (LinusAppointment linusAppointment : linusAppointments) {
            Optional<AppointmentMatching> fetchedAppointment = appointmentMatchingRepository
                .findAppointmentMatchingsByLinusAppointmentId(linusAppointment.getId());

            Appointment appointment;

            if (fetchedAppointment.isEmpty() || fetchedAppointment.get().getAppointment() == null) {
                // No appointment to map ExperimentBookings to.
                notAssignedExperimentBookings++;
                continue;
            } else {
                appointment = fetchedAppointment.get().getAppointment();
            }

            List<LinusExperimentBooking> linusExperimentBookings =
                linusExperimentBookingRepository.findByLinusAppointmentId(linusAppointment.getId());

            List<ExperimentBooking> newExperimentBookings = new ArrayList<>();

            for (LinusExperimentBooking linusExperimentBooking : linusExperimentBookings) {

                Optional<ExperimentBooking> existingBooking = experimentBookingRepository
                    .findExperimentBookingByLinusExperimentBookingId(
                        linusExperimentBooking.getId()
                    );

                if (existingBooking.isPresent()) {
                    // Do not add new booking, already existent
                    continue;
                }

                String experimentNote = "";

                final int maxLinusAppointmentCommentLength = 4096;
                final String linusComment = linusAppointment.getComment();
                experimentNote += UtilityFunctions.truncateStringIfNeccessary(linusComment,
                    maxLinusAppointmentCommentLength);

                // When adding new things to the note change this to a sum of lengths
                assert maxLinusAppointmentCommentLength <= 4096;

                Optional<Person> appointmentRequester = personRepository
                    .findPersonByLinusUserId(linusExperimentBooking.getLinusUserId());

                ExperimentBooking newExperimentBooking = ExperimentBooking.builder()
                    .id(null)
                    .linusExperimentId(linusExperimentBooking.getLinusExperimentId())
                    .linusExperimentBookingId(linusExperimentBooking.getId())
                    .person(appointmentRequester.orElse(null))
                    .appointment(appointment)
                    .notes(experimentNote)
                    .status(ExperimentPreparationStatus.PENDING)
                    .build();

                newExperimentBookings.add(newExperimentBooking);
            }

            List<ExperimentBooking> savedExperimentBookings =
                experimentBookingRepository.saveAll(newExperimentBookings);

            if (!savedExperimentBookings.isEmpty()) {
                SseController.notifyAllOfObject(SseMessageType.LINUSBOOKINGSIMPORT,
                    savedExperimentBookings);
            }

            if (notAssignedExperimentBookings > 0) {
                log.warning(
                    "There were " + notAssignedExperimentBookings + " " +
                        "experimentBookings that could not be matched because " +
                        "the matched appointment was null.");
            }

            log.info("Imported " + savedExperimentBookings.size() + " experiments for " +
                "appointment id=" + appointment.getId() + " from linus");
        }
    }
}
