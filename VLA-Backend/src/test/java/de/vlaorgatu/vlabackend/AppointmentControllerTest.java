package de.vlaorgatu.vlabackend;

import de.vlaorgatu.vlabackend.controller.vladb.AppointmentController;
import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentCategory;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentSeries;
import de.vlaorgatu.vlabackend.exceptions.InvalidParameterException;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentCategoryRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentSeriesRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * Test for {@link AppointmentController}.
 */
@SpringBootTest
@Transactional
@Testcontainers
@Import(TestcontainersConfiguration.class)
public class AppointmentControllerTest {

    @Autowired
    private AppointmentController appointmentController;

    @Autowired
    private AppointmentCategoryRepository appointmentCategoryRepository;

    @Autowired
    private AppointmentSeriesRepository appointmentSeriesRepository;

    @BeforeEach
    void setup() {
        AppointmentCategory cat = appointmentCategoryRepository.save(AppointmentCategory.builder()
            .title("Category")
            .build()
        );

        appointmentSeriesRepository.save(AppointmentSeries.builder()
            .name("Series")
            .category(cat)
            .build()
        );
    }

    @Test
    void defaultGet() {
        Assertions.assertEquals(List.of(), appointmentController.getAll().getBody());
    }

    @Test
    void createAppointmentErrorWithSetId() {
        Assertions.assertThrowsExactly(InvalidParameterException.class, () ->
            appointmentController.createAppointment(Appointment.builder().id(1L).build())
        );
    }

    @Test
    void createAppointment() {
        Appointment appointment = Appointment.builder()
            .series(appointmentSeriesRepository.findAll().getFirst())
            .startTime(LocalDateTime.now())
            .endTime(LocalDateTime.now())
            .build();

        appointmentController.createAppointment(appointment);

        Assertions.assertEquals(appointment, appointmentController.getAll().getBody().getFirst());
    }

    @Test
    void updatedCreatedAppointment() {
        Appointment appointment = Appointment.builder()
            .series(appointmentSeriesRepository.findAll().getFirst())
            .startTime(LocalDateTime.now())
            .endTime(LocalDateTime.now())
            .build();

        appointment = appointmentController.createAppointment(appointment).getBody();

        Appointment appointment2 = Appointment.builder()
            .series(appointmentSeriesRepository.findAll().getFirst())
            .startTime(LocalDateTime.now())
            .endTime(LocalDateTime.now())
            .build();

        appointment2 = appointmentController.createAppointment(appointment2).getBody();

        appointmentController.updateAppointment(appointment2.getId(), Appointment.builder()
            .series(appointmentSeriesRepository.findAll().getFirst())
            .startTime(LocalDateTime.now())
            .endTime(LocalDateTime.now())
            .notes("notes")
            .build()
        );

        Assertions.assertEquals(2, appointmentController.getAll().getBody().size());
        Assertions.assertEquals(appointment,
            appointmentController.getById(appointment.getId()).getBody());
        Assertions.assertNotEquals("",
            appointmentController.getById(appointment2.getId()).getBody().getNotes());
    }
}
