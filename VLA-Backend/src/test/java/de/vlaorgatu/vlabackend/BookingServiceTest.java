package de.vlaorgatu.vlabackend;

import static org.junit.jupiter.api.Assertions.assertEquals;

import de.vlaorgatu.vlabackend.controller.vladb.AppointmentMatchingController;
import de.vlaorgatu.vlabackend.databasesync.Linussyncservice;
import de.vlaorgatu.vlabackend.entities.linusdb.LinusAppointment;
import de.vlaorgatu.vlabackend.entities.linusdb.LinusExperiment;
import de.vlaorgatu.vlabackend.entities.linusdb.LinusExperimentBooking;
import de.vlaorgatu.vlabackend.helperclasses.requestbodytemplates.TimeFrame;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusAppointmentRepository;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusExperimentBookingRepository;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusExperimentRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentMatchingRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.ExperimentBookingRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDateTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.transaction.annotation.Transactional;

/**
 * Tests...
 * {@link AppointmentMatchingController}
 * {@link Linussyncservice}
 */
@SpringBootTest
@Import(TestcontainersConfiguration.class)
public class BookingServiceTest {

    /**
     * Repository for the appropriate entity.
     */
    @Autowired
    private LinusAppointmentRepository linusAppointmentRepository;

    /**
     * Repository for the appropriate entity.
     */
    @Autowired
    private LinusExperimentBookingRepository linusExperimentBookingRepository;

    /**
     * Repository for the appropriate entity.
     */
    @Autowired
    private LinusExperimentRepository linusExperimentRepository;

    /**
     * Repository for the appropriate entity.
     */
    @Autowired
    private AppointmentMatchingRepository appointmentMatchingRepository;

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
     * Repository for the appropriate entity.
     */
    @Autowired
    private AppointmentMatchingController appointmentMatchingController;

    /**
     * Entity manager for manipulating read-only linus-db.
     */
    @PersistenceContext(unitName = "linusEntityManagerFactory")
    private EntityManager linusEntityManager;

    /**
     * Sets up the appointments and databases.
     */
    @Transactional("linusTransactionManager")
    @BeforeEach
    void setup() {
        linusEntityManager.clear();
        appointmentMatchingRepository.deleteAll();
        appointmentRepository.deleteAll();
        experimentBookingRepository.deleteAll();

        linusEntityManager.persist(
            LinusAppointment.builder()
                .id(1)
                .linusUserId(1)
                .orderTime(LocalDateTime.of(2026, 1, 1, 0, 0))
                .status(0)
                .appointmentTime(LocalDateTime.of(2026, 3, 1, 0, 0))
                .comment("")
                .name("")
                .build()
        );

        linusEntityManager.persist(
            LinusAppointment.builder()
                .id(2)
                .linusUserId(1)
                .orderTime(LocalDateTime.of(2026, 2, 1, 0, 0))
                .status(0)
                .appointmentTime(LocalDateTime.of(2026, 3, 1, 0, 0))
                .comment("")
                .name("")
                .build()
        );

        linusEntityManager.persist(
            LinusExperimentBooking.builder()
                .id(1)
                .linusAppointmentId(1)
                .linusExperimentId(1)
                .linusUserId(1)
                .status(0)
                .pinnedOn(LocalDateTime.of(2026, 1, 1, 0, 0))
                .build()
        );

        linusEntityManager.persist(
            LinusExperimentBooking.builder()
                .id(2)
                .linusAppointmentId(2)
                .linusExperimentId(2)
                .linusUserId(1)
                .status(0)
                .pinnedOn(LocalDateTime.of(2023, 1, 1, 0, 0))
                .build()
        );

        linusEntityManager.persist(
            LinusExperiment.builder()
                .id(1)
                .categoryId(1)
                .name("")
                .description("")
                .comment("")
                .preparationTime(20)
                .status("")
                .executionTime(20)
                .safetySigns("[]")
                .experimentNumber(1)
                .build()
        );

        linusEntityManager.persist(
            LinusExperiment.builder()
                .id(2)
                .categoryId(1)
                .name("")
                .description("")
                .comment("")
                .preparationTime(20)
                .status("")
                .executionTime(20)
                .safetySigns("[]")
                .experimentNumber(1)
                .build()
        );

        linusEntityManager.flush();
    }

    /**
     * Should error when setup of this test is tempered with.
     */
    @Transactional("linusTransactionManager")
    @Test
    void checkCorrectSetup() {
        assertEquals(2, linusAppointmentRepository.findAll().size());
        assertEquals(2, linusExperimentBookingRepository.findAll().size());
        assertEquals(2, linusExperimentRepository.findAll().size());
    }

    /**
     * Check that nothing happens if nothing is in the {@link TimeFrame}.
     */
    @Transactional("linusTransactionManager")
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
    @Transactional("linusTransactionManager")
    @Test
    void checkTwoAppointmentsOnOneDay() {
        appointmentMatchingController.matchAppointments(
            new TimeFrame(
                LocalDateTime.of(2026, 3, 1, 0, 0),
                LocalDateTime.of(2026, 3, 1, 0, 0)
            )
        );

        assertEquals(2, appointmentMatchingRepository.findAll().size());
    }
}
