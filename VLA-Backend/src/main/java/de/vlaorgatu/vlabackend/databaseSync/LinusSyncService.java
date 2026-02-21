package de.vlaorgatu.vlabackend.databaseSync;

import de.vlaorgatu.vlabackend.controller.sse.SseController;
import de.vlaorgatu.vlabackend.entities.linusdb.LinusAppointment;
import de.vlaorgatu.vlabackend.entities.linusdb.LinusExperimentBooking;
import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentCategory;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentSeries;
import de.vlaorgatu.vlabackend.entities.vladb.ExperimentBooking;
import de.vlaorgatu.vlabackend.entities.vladb.Person;
import de.vlaorgatu.vlabackend.enums.calendar.experimentbooking.ExperimentPreparationStatus;
import de.vlaorgatu.vlabackend.enums.sse.SseMessageType;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusAppointmentRepository;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusExperimentBookingRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentCategoryRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentSeriesRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.ExperimentBookingRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.PersonRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;
import java.util.logging.Logger;
import lombok.AllArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
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
    private final PersonRepository vlaPersonDb;

    @Transactional
    public void syncBookings() {
        List<LinusExperimentBooking> linusExperiments = linusExperimentBookingRepository.findAll();

        linusExperiments.stream().filter(linusExperimentBooking ->
        {
            return experimentBookingRepository
                .findByLinusExperimentBookingId(linusExperimentBooking.getId()).isEmpty();
        }).forEach(toBeSavedBooking -> {
            ExperimentBooking newEntry = new ExperimentBooking();
            newEntry.setLinusExperimentBookingId(toBeSavedBooking.getId());
            newEntry.setLinusExperimentId(toBeSavedBooking.getLinusExperimentId());
            List<Person> person = vlaPersonDb.findByLinusUserId(toBeSavedBooking.getLinusUserId());
            // TODO: make new person if there is no person with linusUserId (linusUser needed)
            if (!person.isEmpty()) {
                newEntry.setPerson(person.getFirst());
            }
            // TODO: appointment
            // no notes here because in linus notes are attached to the appointment
            experimentBookingRepository.save(newEntry);
        });
    }

    // TODO: make method for syncing appointment notes.

    @Transactional
    public void syncAppointments(LocalDateTime start, LocalDateTime end) {
        List<LinusAppointment> linusAppointments =
            linusAppointmentRepository.findByAppointmentTimeBetween(start, end);

        List<Appointment> newAppointments = new ArrayList<>();

        Optional<AppointmentCategory> fetchedCategory =
            appointmentCategoryRepository.findByTitle("LinusAppointmentImports");

        AppointmentCategory category;

        if (fetchedCategory.isPresent()) {
            category = fetchedCategory.get();
        } else {
            AppointmentCategory linusAppointmentImports = AppointmentCategory.builder()
                .id(null)
                .title("LinusAppointmentImports")
                .build();
            category = appointmentCategoryRepository.save(linusAppointmentImports);
        }

        for (LinusAppointment linusAppointment : linusAppointments) {
            Optional<Appointment> appointment =
                appointmentRepository.findByLinusAppointmentId(linusAppointment.getId());

            if (appointment.isPresent()) {
                continue;
            }

            if (linusAppointment.getAppointmentTime() == null) {
                continue;
            }

            AppointmentSeries newAppointmentSeries = AppointmentSeries.builder()
                .id(null)
                .lecture(null)
                .name("LinusImport")
                .category(category)
                .build();

            newAppointmentSeries = appointmentSeriesRepository.save(newAppointmentSeries);

            Appointment newAppointment = Appointment.builder()
                .id(null)
                .series(newAppointmentSeries)
                .start(linusAppointment.getAppointmentTime())
                .end(linusAppointment.getAppointmentTime().plusMinutes(100))
                .notes((linusAppointment.getComment() + "\n\nImportiert aus Linus").trim())
                .linusAppointmentId(linusAppointment.getId())
                .build();

            newAppointments.add(newAppointment);
        }

        List<Appointment> savedAppointments = appointmentRepository.saveAll(newAppointments);

        SseController.notifyAllOfObject(SseMessageType.LINUSAPPOINTMENTIMPORT, savedAppointments);

        log.info("Imported " + savedAppointments.size() + " appointments from linus");
    }

    @Transactional
    public void syncExperimentBookings(LocalDateTime start, LocalDateTime end) {
        syncAppointments(start, end);

        List<LinusAppointment> linusAppointments =
            linusAppointmentRepository.findByAppointmentTimeBetween(start, end);

        for (LinusAppointment linusAppointment : linusAppointments) {
            Optional<Appointment> retrievedAppointment =
                appointmentRepository.findByLinusAppointmentId(linusAppointment.getId());

            if (retrievedAppointment.isEmpty()) {
                // ??? This should not happen ???
                log.warning("Could not find appointment with linus_appointment_id " +
                    linusAppointment.getId());
                continue;
            }

            Appointment appointment = retrievedAppointment.get();

            List<LinusExperimentBooking> linusExperimentBookings =
                linusExperimentBookingRepository.findByLinusAppointmentId(linusAppointment.getId());

            List<ExperimentBooking> experimentBookings = new ArrayList<>();

            for (LinusExperimentBooking linusExperimentBooking : linusExperimentBookings) {
                ExperimentBooking newExperimentBooking = ExperimentBooking.builder()
                    .id(null)
                    .linusExperimentId(linusExperimentBooking.getLinusExperimentId())
                    .linusExperimentBookingId(linusExperimentBooking.getId())
                    // TODO: Think about adding the linus users
                    .person(null)
                    .appointment(appointment)
                    // TODO: Think about note import more (from appointment or leave it at that?)
                    .notes("")
                    .status(ExperimentPreparationStatus.PENDING)
                    .build();

                experimentBookings.add(newExperimentBooking);
            }

            List<ExperimentBooking> savedExperimentBookings =
                experimentBookingRepository.saveAll(experimentBookings);

            SseController.notifyAllOfObject(SseMessageType.LINUSBOOKINGSIMPORT,
                savedExperimentBookings);

            log.info("Imported " + savedExperimentBookings.size() + " experiments for " +
                "appointment id=" + appointment.getId() + " from linus");
        }
    }
}
