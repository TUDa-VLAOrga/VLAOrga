package de.vlaorgatu.vlabackend.databaseSync;

import static de.vlaorgatu.vlabackend.UtilityFunctions.truncateStringIfNeccessary;

import de.vlaorgatu.vlabackend.UtilityFunctions;
import de.vlaorgatu.vlabackend.controller.sse.SseController;
import de.vlaorgatu.vlabackend.entities.linusdb.LinusAppointment;
import de.vlaorgatu.vlabackend.entities.linusdb.LinusExperimentBooking;
import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentMatching;
import de.vlaorgatu.vlabackend.entities.vladb.ExperimentBooking;
import de.vlaorgatu.vlabackend.enums.calendar.experimentbooking.ExperimentPreparationStatus;
import de.vlaorgatu.vlabackend.enums.sse.SseMessageType;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusAppointmentRepository;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusExperimentBookingRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentCategoryRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentMatchingRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentSeriesRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.ExperimentBookingRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Optional;
import java.util.Set;
import java.util.logging.Logger;
import java.util.stream.Stream;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class LinusSyncService {
    private final Logger log = Logger.getLogger(this.getClass().getName());

    private final LinusAppointmentRepository linusAppointmentRepository;
    private final LinusExperimentBookingRepository linusExperimentBookingRepository;

    private final AppointmentCategoryRepository appointmentCategoryRepository;
    private final AppointmentSeriesRepository appointmentSeriesRepository;
    private final AppointmentRepository appointmentRepository;
    private final ExperimentBookingRepository experimentBookingRepository;
    private final AppointmentMatchingRepository appointmentMatchingRepository;

    /**
     * Remnant from an initial draft (To be extended?)
     * TODO: Is this still needed?
     */
//    @Transactional
//    public void syncBookings() {
//        List<LinusExperimentBooking> linusExperiments = linusExperimentBookingRepository.findAll();
//
//        linusExperiments.stream().filter(linusExperimentBooking ->
//        {
//            return experimentBookingRepository
//                .findByLinusExperimentBookingId(linusExperimentBooking.getId()).isEmpty();
//        }).forEach(toBeSavedBooking -> {
//            ExperimentBooking newEntry = new ExperimentBooking();
//            newEntry.setLinusExperimentBookingId(toBeSavedBooking.getId());
//            newEntry.setLinusExperimentId(toBeSavedBooking.getLinusExperimentId());
//            List<Person> person = vlaPersonDb.findByLinusUserId(toBeSavedBooking.getLinusUserId());
//            // TODO: make new person if there is no person with linusUserId (linusUser needed)
//            if (!person.isEmpty()) {
//                newEntry.setPerson(person.getFirst());
//            }
//            // TODO: appointment
//            // no notes here because in linus notes are attached to the appointment
//            experimentBookingRepository.save(newEntry);
//        });
//    }

    // TODO: make method for syncing appointment notes.

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
     * TODO: Syncs linus_reservations_experiments with valid appointment dates to {@link Appointment}s.
     * This looks for linus bookings that reference linus_reservations in a given time frame.
     *
     * @param start The start of the time frame that should be synced
     * @param end   The end of the time frame that should be synced
     */
    @Transactional
    public void syncMatchedAppointmentsExperimentBookings(LocalDateTime start, LocalDateTime end) {
        List<LinusAppointment> linusAppointments =
            linusAppointmentRepository.findByAppointmentTimeBetween(start, end);

        for (LinusAppointment linusAppointment : linusAppointments) {
            Optional<AppointmentMatching> fetchedAppointment = appointmentMatchingRepository
                .findAppointmentMatchingsByLinusAppointmentId(linusAppointment.getId());

            Appointment appointment;

            if (fetchedAppointment.isEmpty() || fetchedAppointment.get().getAppointment() == null) {
                // No appointment to map ExperimentBookings to.
                continue;
            } else {
                appointment = fetchedAppointment.get().getAppointment();
            }

            List<Integer> alreadyRegisteredLinusExperimentIds = appointment
                .getBookings().stream()
                .map(ExperimentBooking::getLinusExperimentBookingId).toList();

            List<LinusExperimentBooking> linusExperimentBookings =
                linusExperimentBookingRepository.findByLinusAppointmentId(linusAppointment.getId());

            List<ExperimentBooking> newExperimentBookings = new ArrayList<>();

            for (LinusExperimentBooking linusExperimentBooking : linusExperimentBookings) {

                if (alreadyRegisteredLinusExperimentIds.contains(linusExperimentBooking.getId())) {
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

                ExperimentBooking newExperimentBooking = ExperimentBooking.builder()
                    .id(null)
                    .linusExperimentId(linusExperimentBooking.getLinusExperimentId())
                    .linusExperimentBookingId(linusExperimentBooking.getId())
                    .person(null)
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

            log.info("Imported " + savedExperimentBookings.size() + " experiments for " +
                "appointment id=" + appointment.getId() + " from linus");
        }
    }
}
