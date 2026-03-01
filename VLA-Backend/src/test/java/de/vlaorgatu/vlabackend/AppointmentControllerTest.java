package de.vlaorgatu.vlabackend;

import de.vlaorgatu.vlabackend.controller.vladb.AppointmentController;
import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentCategory;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentSeries;
import de.vlaorgatu.vlabackend.entities.vladb.User;
import de.vlaorgatu.vlabackend.exceptions.InvalidParameterException;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentCategoryRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentSeriesRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.UserRepository;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

/**
 * Tests for {@link AppointmentController}.
 */

@SpringBootTest
@Import(TestcontainersConfiguration.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ActiveProfiles("unsecure")
public class AppointmentControllerTest {

    /**
     * Instance of {@link AppointmentController}.
     */
    @Autowired
    private AppointmentController appointmentController;

    /**
     * Instance of {@link TestUtils}.
     */
    @Autowired
    private TestUtils testUtils;

    /**
     * Instance of {@link AppointmentCategoryRepository}.
     */
    @Autowired
    private AppointmentCategoryRepository appointmentCategoryRepository;

    /**
     * Instance of {@link AppointmentSeriesRepository}.
     */
    @Autowired
    private AppointmentSeriesRepository appointmentSeriesRepository;

    /**
     * Instance of {@link AppointmentRepository}.
     */
    @Autowired
    private AppointmentRepository appointmentRepository;

    /**
     * Instance of {@link UserRepository}.
     */
    @Autowired
    private UserRepository userRepository;

    @BeforeAll
    void beforeAll() {
        testUtils.clearVlaDb();

        AppointmentCategory category = appointmentCategoryRepository.save(
            AppointmentCategory.builder()
                .id(null)
                .title("Category")
                .build()
        );

        AppointmentSeries series = appointmentSeriesRepository.save(
            AppointmentSeries.builder()
                .id(null)
                .lecture(null)
                .name("Series")
                .category(category)
                .build()
        );

        // Gets id = 1
        appointmentRepository.save(
            Appointment.builder()
                .id(null)
                .series(series)
                .startTime(LocalDateTime.now())
                .endTime(LocalDateTime.now())
                .notes("")
                .deletingIntentionUser(null)
                .build()
        );

        userRepository.save(User.builder()
            .id(null)
            .name("1")
            .email("1@example.com")
            .build()
        );

        userRepository.save(User.builder()
            .id(null)
            .name("2")
            .email("2@example.com")
            .build()
        );
    }

    @Transactional("vlaTransactionManager")
    @Test
    void checkSetup() {
        Assertions.assertEquals(1, appointmentCategoryRepository.findAll().size());
        Assertions.assertEquals(1, appointmentSeriesRepository.findAll().size());
        Assertions.assertEquals(1, appointmentRepository.findAll().size());
        Assertions.assertEquals(1, appointmentRepository.findAll().getFirst().getId());
        Assertions.assertEquals(1, userRepository.findAll().getFirst().getId());
        Assertions.assertEquals(2, userRepository.findAll().getLast().getId());
    }

    @Transactional("vlaTransactionManager")
    @Test
    void checkAppointmentSingleDeletionSetsIntent() {
        Assertions.assertNull(
            appointmentRepository.findAll().getFirst()
                .getDeletingIntentionUser()
        );

        Assertions.assertEquals(1, appointmentRepository.findAll().getFirst().getId());

        appointmentController.deleteAppointment(1L, 1L);

        Assertions.assertEquals(1L,
            appointmentRepository.findAll().getFirst().getDeletingIntentionUser().getId()
        );
    }

    @Transactional("vlaTransactionManager")
    @Test
    void checkAppointmentDoubleDeletionSingleUser() {
        Assertions.assertNull(
            appointmentRepository.findAll().getFirst()
                .getDeletingIntentionUser()
        );
        Assertions.assertEquals(1, appointmentRepository.findAll().getFirst().getId());

        appointmentController.deleteAppointment(1L, 1L);

        Assertions.assertThrowsExactly(
            InvalidParameterException.class,
            () -> appointmentController.deleteAppointment(1L, 1L)
        );
    }

    @Transactional("vlaTransactionManager")
    @Test
    void checkAppointmentDoubleDeletionMultipleUser() {
        Assertions.assertNull(
            appointmentRepository.findAll().getFirst()
                .getDeletingIntentionUser()
        );
        Assertions.assertEquals(1, appointmentRepository.findAll().getFirst().getId());

        appointmentController.deleteAppointment(1L, 1L);
        appointmentController.deleteAppointment(1L, 2L);

        Assertions.assertEquals(0, appointmentRepository.findAll().size());
    }

}
