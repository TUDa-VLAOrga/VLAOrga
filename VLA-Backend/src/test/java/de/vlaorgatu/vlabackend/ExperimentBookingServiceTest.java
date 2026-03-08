package de.vlaorgatu.vlabackend;

import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentCategory;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentSeries;
import de.vlaorgatu.vlabackend.entities.vladb.ExperimentBooking;
import de.vlaorgatu.vlabackend.enums.calendar.experimentbooking.ExperimentPreparationStatus;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentCategoryRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentSeriesRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.ExperimentBookingRepository;
import de.vlaorgatu.vlabackend.services.ExperimentBookingService;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * Tests the {@link ExperimentBookingService}.
 */
@SpringBootTest
@Transactional
@Testcontainers
@Import(TestcontainersConfiguration.class)
public class ExperimentBookingServiceTest {
    @Autowired
    private AppointmentCategoryRepository appointmentCategoryRepository;

    @Autowired
    private AppointmentSeriesRepository appointmentSeriesRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ExperimentBookingRepository experimentBookingRepository;

    @Autowired
    private ExperimentBookingService service;

    @BeforeEach
    void setup() {
        AppointmentCategory cat = appointmentCategoryRepository.save(AppointmentCategory.builder()
            .title("Category").build()
        );

        appointmentSeriesRepository.save(AppointmentSeries.builder()
            .name("NoLectureSeries")
            .category(cat)
            .appointments(new ArrayList<>())
            .build()
        );
    }

    @Test
    void testEmptyBookingTransfer() {
        Appointment source = appointmentRepository.save(Appointment.builder()
            .series(appointmentSeriesRepository.findAll().getFirst())
            .startTime(LocalDateTime.of(2026, 1, 1, 0, 0))
            .endTime(LocalDateTime.of(2026, 1, 1, 1, 0))
            .bookings(new ArrayList<>())
            .notes("")
            .build()
        );

        Appointment target = appointmentRepository.save(Appointment.builder()
            .series(appointmentSeriesRepository.findAll().getFirst())
            .startTime(LocalDateTime.of(2026, 1, 1, 0, 0))
            .endTime(LocalDateTime.of(2026, 1, 1, 1, 0))
            .bookings(new ArrayList<>())
            .notes("")
            .build()
        );

        List<ExperimentBooking> srcinit = experimentBookingRepository.saveAll(
            List.of(
                ExperimentBooking.builder()
                    .linusExperimentId(1)
                    .linusExperimentBookingId(1)
                    .appointment(source)
                    .notes("src.1")
                    .status(ExperimentPreparationStatus.PENDING)
                    .build(),

                ExperimentBooking.builder()
                    .linusExperimentId(1)
                    .linusExperimentBookingId(1)
                    .appointment(source)
                    .notes("src.2")
                    .status(ExperimentPreparationStatus.PENDING)
                    .build()
            )
        );

        source.getBookings().addAll(srcinit);

        Assertions.assertEquals(
            2,
            appointmentRepository.findById(source.getId()).get().getBookings().size()
        );

        service.moveExperimentBookings(source, target);

        Assertions.assertEquals(
            0,
            appointmentRepository.findById(source.getId()).get().getBookings().size()
        );

        Assertions.assertEquals(
            2,
            appointmentRepository.findById(target.getId()).get().getBookings().size()
        );
    }

    @Test
    void testNonEmptyBookingTransfer() {
        Appointment source = appointmentRepository.save(Appointment.builder()
            .series(appointmentSeriesRepository.findAll().getFirst())
            .startTime(LocalDateTime.of(2026, 1, 1, 0, 0))
            .endTime(LocalDateTime.of(2026, 1, 1, 1, 0))
            .bookings(new ArrayList<>())
            .notes("")
            .build()
        );

        Appointment target = appointmentRepository.save(Appointment.builder()
            .series(appointmentSeriesRepository.findAll().getFirst())
            .startTime(LocalDateTime.of(2026, 1, 1, 0, 0))
            .endTime(LocalDateTime.of(2026, 1, 1, 1, 0))
            .bookings(new ArrayList<>())
            .notes("")
            .build()
        );

        List<ExperimentBooking> srcinit = experimentBookingRepository.saveAll(
            List.of(
                ExperimentBooking.builder()
                    .linusExperimentId(1)
                    .linusExperimentBookingId(1)
                    .appointment(source)
                    .notes("src.1")
                    .status(ExperimentPreparationStatus.PENDING)
                    .build(),

                ExperimentBooking.builder()
                    .linusExperimentId(1)
                    .linusExperimentBookingId(1)
                    .appointment(source)
                    .notes("src.2")
                    .status(ExperimentPreparationStatus.PENDING)
                    .build()
            )
        );

        List<ExperimentBooking> targetinit = experimentBookingRepository.saveAll(
            List.of(
                ExperimentBooking.builder()
                    .linusExperimentId(1)
                    .linusExperimentBookingId(1)
                    .appointment(target)
                    .notes("target.1")
                    .status(ExperimentPreparationStatus.PENDING)
                    .build(),

                ExperimentBooking.builder()
                    .linusExperimentId(1)
                    .linusExperimentBookingId(1)
                    .appointment(target)
                    .notes("target.2")
                    .status(ExperimentPreparationStatus.PENDING)
                    .build(),

                ExperimentBooking.builder()
                    .linusExperimentId(1)
                    .linusExperimentBookingId(1)
                    .appointment(target)
                    .notes("target.3")
                    .status(ExperimentPreparationStatus.PENDING)
                    .build()
            )
        );

        source.getBookings().addAll(srcinit);
        target.getBookings().addAll(targetinit);

        Assertions.assertEquals(
            2,
            appointmentRepository.findById(source.getId()).get().getBookings().size()
        );

        service.moveExperimentBookings(source, target);

        Assertions.assertEquals(
            0,
            appointmentRepository.findById(source.getId()).get().getBookings().size()
        );

        Assertions.assertEquals(
            5,
            appointmentRepository.findById(target.getId()).get().getBookings().size()
        );

        Set<String> notes = Set.of("src.1", "src.2", "target.1", "target.2", "target.3");
        Set<String> includedNotes = new HashSet<>(notes);
        for (ExperimentBooking booking : target.getBookings()) {
            includedNotes.add(booking.getNotes());
        }

        Assertions.assertEquals(notes, includedNotes);
    }
}
