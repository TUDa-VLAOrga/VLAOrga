package de.vlaorgatu.vlabackend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import de.vlaorgatu.vlabackend.controller.vladb.AppointmentController;
import de.vlaorgatu.vlabackend.controller.vladb.AppointmentMatchingController;
import de.vlaorgatu.vlabackend.databasesync.Linussyncservice;
import de.vlaorgatu.vlabackend.entities.linusdb.LinusAppointment;
import de.vlaorgatu.vlabackend.entities.linusdb.LinusExperiment;
import de.vlaorgatu.vlabackend.entities.linusdb.LinusExperimentBooking;
import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentCategory;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentMatching;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentSeries;
import de.vlaorgatu.vlabackend.helperclasses.requestbodytemplates.TimeFrame;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusAppointmentRepository;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusExperimentBookingRepository;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusExperimentRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentCategoryRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentMatchingRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentSeriesRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.ExperimentBookingRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * Tests...
 * {@link AppointmentMatchingController}
 * {@link Linussyncservice}
 */
@SpringBootTest
@Transactional
@Testcontainers
@Import(TestcontainersConfiguration.class)
public class BookingServiceTest {
    /**
     * Repository for the appropriate entity.
     */
    @Autowired
    private AppointmentMatchingRepository appointmentMatchingRepository;

    /**
     * Repository for the appropriate entity.
     */
    @Autowired
    private AppointmentCategoryRepository appointmentCategoryRepository;

    /**
     * Repository for the appropriate entity.
     */
    @Autowired
    private AppointmentSeriesRepository appointmentSeriesRepository;

    /**
     * Repository for the appropriate entity.
     */
    @Autowired
    private AppointmentRepository appointmentRepository;

    /**
     * Repository for the appropriate entity.
     */
    @Autowired
    private ExperimentBookingRepository experimentBookingRepository;

    /**
     * Controller for the appropriate entity.
     */
    @Autowired
    private AppointmentMatchingController appointmentMatchingController;

    /**
     * Controller for the appropriate entity.
     */
    @Autowired
    private AppointmentController appointmentController;

    /**
     * Sets up...
     * LinusAppointment 1 -> LinusBooking 1 -> LinusExperiment 1
     * LinusAppointment 2 -> LinusBooking 2 -> LinusExperiment 1
     * Lonely LinusExperiment 2
     */
    @MockitoBean
    private LinusAppointmentRepository linusAppointmentRepository;

    @MockitoBean
    private LinusExperimentBookingRepository linusExperimentBookingRepository;

    @MockitoBean
    private LinusExperimentRepository linusExperimentRepository;

    @SuppressWarnings("checkstyle:LineLength")
    @BeforeEach
    void setup() {
        LinusExperiment experiment1 =
            LinusExperiment.builder().id(1).categoryId(1).name("").status("").experimentNumber(1)
                .build();

        LinusExperiment experiment2 =
            LinusExperiment.builder().id(2).categoryId(2).name("").status("").experimentNumber(2)
                .build();

        LinusAppointment linusAppointment1 = LinusAppointment.builder().id(1).linusUserId(1)
            .appointmentTime(
                LocalDateTime.of(2026, 3, 1, 1, 0)
            )
            .build();

        LinusAppointment linusAppointment2 = LinusAppointment.builder().id(2).linusUserId(1)
            .appointmentTime(
                LocalDateTime.of(2026, 3, 1, 2, 0)
            )
            .build();

        LinusExperimentBooking linusExperimentBooking1 =
            LinusExperimentBooking.builder().id(1).linusExperimentId(1).linusUserId(1)
                .linusAppointmentId(1).status(0).build();

        LinusExperimentBooking linusExperimentBooking2 =
            LinusExperimentBooking.builder().id(2).linusExperimentId(1).linusUserId(1)
                .linusAppointmentId(2).status(0).build();

        when(linusExperimentRepository.findById(1)).thenReturn(Optional.of(experiment1));
        when(linusExperimentRepository.findById(2)).thenReturn(Optional.of(experiment2));
        when(linusExperimentRepository.findAll()).thenReturn(List.of(experiment1, experiment2));

        when(linusAppointmentRepository.findById(1)).thenReturn(Optional.of(linusAppointment1));
        when(linusAppointmentRepository.findById(2)).thenReturn(Optional.of(linusAppointment2));
        when(linusAppointmentRepository.findAll()).thenReturn(
            List.of(linusAppointment1, linusAppointment2));

        when(
            linusAppointmentRepository
                .findLinusAppointmentsByAppointmentTimeGreaterThanEqualAndAppointmentTimeLessThanEqual(
                    any(LocalDateTime.class),
                    any(LocalDateTime.class)
                )
            )
            .thenAnswer(invocation -> {
                LocalDateTime startTime = invocation.getArgument(0);
                LocalDateTime endTime = invocation.getArgument(1);

                List<LinusAppointment> result = new ArrayList<>();

                if ((linusAppointment1.getAppointmentTime().isAfter(startTime) ||
                    linusAppointment1.getAppointmentTime().isEqual(startTime)) &&
                    (linusAppointment1.getAppointmentTime().isBefore(endTime) ||
                        linusAppointment1.getAppointmentTime().isEqual(endTime))) {
                    result.add(linusAppointment1);
                }

                if ((linusAppointment2.getAppointmentTime().isAfter(startTime) ||
                    linusAppointment2.getAppointmentTime().isEqual(startTime)) &&
                    (linusAppointment2.getAppointmentTime().isBefore(endTime) ||
                        linusAppointment2.getAppointmentTime().isEqual(endTime))) {
                    result.add(linusAppointment2);
                }


                return result;
            });

        when(linusExperimentBookingRepository.findById(1)).thenReturn(
            Optional.of(linusExperimentBooking1));
        when(linusExperimentBookingRepository.findById(2)).thenReturn(
            Optional.of(linusExperimentBooking2));
        when(linusExperimentBookingRepository.findAll()).thenReturn(
            List.of(linusExperimentBooking1, linusExperimentBooking2));
        when(linusExperimentBookingRepository.findByLinusAppointmentId(1)).thenReturn(
            List.of(linusExperimentBooking1));
        when(linusExperimentBookingRepository.findByLinusAppointmentId(2)).thenReturn(
            List.of(linusExperimentBooking2));
    }


    /**
     * Should error when setup of this test is tempered with.
     */
    @Test
    void checkCorrectDbSetup() {
        assertEquals(2, linusAppointmentRepository.findAll().size());
        assertEquals(2, linusExperimentBookingRepository.findAll().size());
        assertEquals(2, linusExperimentRepository.findAll().size());
    }

    /**
     * Check that nothing happens if nothing is in the {@link TimeFrame}.
     */
    @Transactional("vlaTransactionManager")
    @Test
    void checkNoAppointmentsPlannedInTimeFrame() {
        appointmentMatchingController.matchAppointments(
            new TimeFrame(
                LocalDateTime.of(2026, 1, 1, 0, 0),
                LocalDateTime.of(2026, 1, 1, 0, 0)
            )
        );

        assertEquals(0, appointmentMatchingRepository.findAll().size());
    }

    /**
     * Makes sure that...
     * time frame is inclusive
     * multiple appointments per day are all added
     */
    @Transactional("vlaTransactionManager")
    @Test
    void checkTwoAppointmentsOnOneDay() {
        appointmentMatchingController.matchAppointments(
            new TimeFrame(
                LocalDateTime.of(2026, 3, 1, 0, 0),
                LocalDateTime.of(2026, 3, 1, 2, 0)
            )
        );

        assertEquals(2, appointmentMatchingRepository.findAll().size());
    }

    /**
     * Makes sure that...
     * bookings are appropriately matched
     * Deletion of appointment does not delete bookings
     */
    @Transactional("vlaTransactionManager")
    @Test
    void checkBookingBehavior() {

        AppointmentCategory appointmentCategory =
            AppointmentCategory.builder().id(null).title("Category").build();

        appointmentCategory = appointmentCategoryRepository.save(appointmentCategory);

        AppointmentSeries appointmentSeries =
            AppointmentSeries.builder().id(null).name("Series")
                .category(appointmentCategory).build();

        appointmentSeries = appointmentSeriesRepository.save(appointmentSeries);

        Appointment appointment = Appointment.builder().id(null).series(appointmentSeries)
            .startTime(LocalDateTime.of(2026, 3, 1, 0, 0))
            .endTime(LocalDateTime.of(2026, 3, 1, 2, 0))
            .notes("").bookings(List.of()).build();

        appointment = appointmentRepository.save(appointment);

        appointmentMatchingRepository.save(
            AppointmentMatching.builder().id(null).linusAppointmentId(1)
                .linusAppointmentTime(
                    LocalDateTime.of(2026, 3, 1, 1, 0)
                )
                .appointment(appointment)
                .build());

        Assertions.assertEquals(1, appointmentMatchingRepository.findAll().size());

        appointmentMatchingController.matchExperimentBookings(
            new TimeFrame(LocalDateTime.of(2026, 3, 1, 0, 0),
                LocalDateTime.of(2026, 3, 1, 0, 0))
        );

        Assertions.assertEquals(0,
            appointmentRepository.getAppointmentById(appointment.getId()).get().getBookings()
                .size());

        appointmentMatchingController.matchExperimentBookings(
            new TimeFrame(LocalDateTime.of(2026, 3, 1, 0, 0),
                LocalDateTime.of(2026, 3, 1, 1, 0))
        );

        Assertions.assertEquals(1, experimentBookingRepository.findAll().size());

        Assertions.assertEquals(1, appointmentRepository.findById(1L).get()
            .getBookings().size());

        // Appointment finalAppointment = appointment;
        // Assertions.assertThrows(
        //     InvalidParameterException.class,
        //     () -> appointmentController.deleteAppointment(finalAppointment.getId())
        // );
    }
}
