package de.vlaorgatu.vlabackend;

import de.vlaorgatu.vlabackend.controller.vladb.AcceptanceController;
import de.vlaorgatu.vlabackend.controller.vladb.AppointmentCategoryController;
import de.vlaorgatu.vlabackend.controller.vladb.AppointmentController;
import de.vlaorgatu.vlabackend.controller.vladb.AppointmentSeriesController;
import de.vlaorgatu.vlabackend.controller.vladb.LectureController;
import de.vlaorgatu.vlabackend.controller.vladb.PersonController;
import de.vlaorgatu.vlabackend.entities.vladb.Acceptance;
import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentCategory;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentSeries;
import de.vlaorgatu.vlabackend.entities.vladb.Lecture;
import de.vlaorgatu.vlabackend.entities.vladb.Person;
import de.vlaorgatu.vlabackend.exceptions.InvalidParameterException;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * Tests for backend entity operations, using the Controller classes.
 */
@SpringBootTest
@Transactional
@Testcontainers
@Import(TestcontainersConfiguration.class)
public class VlaBackendEntitiesTest {

    // Sample Data
    Lecture lecture = Lecture.builder()
        .id(1L)
        .name("Physik 1")
        .semester("WS 25/26")
        .color("#FFFF00")
        .persons(null)
        .build();

    Person person = Person.builder()
        .id(1L)
        .name("Dr. Alberner Stein")
        .email("")
        .notes("bitte grünen Laserpointer")
        .linusUserId(42)
        .build();

    AppointmentCategory appCategory = new AppointmentCategory(1L, "Vorlesung");

    AppointmentSeries appSeries = AppointmentSeries.builder()
        .id(1L)
        .lecture(lecture)
        .name("Serie")
        .category(appCategory)
        .build();

    Appointment appointment =
        Appointment.builder()
            .id(1L)
            .series(appSeries)
            .startTime(LocalDateTime.parse("2025-10-14T09:50:00"))
            .endTime(LocalDateTime.parse("2025-10-14T11:30:00"))
            .notes("Mit Willkommensgeschenk zum Semesterstart!")
            .bookings(List.of())
            .build();

    Acceptance acceptance = Acceptance.builder()
        .id(1L)
        .appointment(appointment)
        .startTime(LocalDateTime.parse("2025-10-13T17:00:00"))
        .endTime(LocalDateTime.parse("2025-10-13T17:30:00"))
        .build();

    // Controllers
    @Autowired
    LectureController lectureController;
    @Autowired
    PersonController personController;
    @Autowired
    AppointmentCategoryController appCatController;
    @Autowired
    AppointmentSeriesController appSeriesController;
    @Autowired
    AppointmentController appController;
    @Autowired
    AcceptanceController acceptanceController;

    @Rollback
    @Transactional
    @Test
    void entityCreationTest() {
        Assertions.assertThrows(InvalidParameterException.class,
            () -> lectureController.createLecture(lecture));
        lecture.setId(null);
        Lecture responseLecture = lectureController.createLecture(lecture).getBody();
        Assertions.assertEquals(lecture, responseLecture);
        Assertions.assertNotNull(lecture.getId());  // got set on saving

        // empty datasets are filled with default (empty string)
        Lecture emptyLecture = new Lecture();
        Lecture emptyExpected = Lecture.builder().id(2L).build();
        Assertions.assertEquals(emptyExpected.getId(),
            lectureController.createLecture(emptyLecture).getBody().getId());

        Assertions.assertThrows(InvalidParameterException.class,
            () -> personController.createPerson(person));
        person.setId(null);
        Person savedPerson = personController.createPerson(person).getBody();
        Assertions.assertEquals(person, savedPerson);
        Assertions.assertNotNull(person.getId());

        Assertions.assertThrows(InvalidParameterException.class,
            () -> appCatController.createAppointmentCategory(appCategory));
        appCategory.setId(null);
        AppointmentCategory savedAppCat =
            appCatController.createAppointmentCategory(appCategory).getBody();
        Assertions.assertEquals(appCategory, savedAppCat);
        Assertions.assertNotNull(appCategory.getId());

        Assertions.assertThrows(InvalidParameterException.class,
            () -> appSeriesController.createAppointmentSeries(appSeries));
        appSeries.setId(null);
        AppointmentSeries savedAppSeries =
            appSeriesController.createAppointmentSeries(appSeries).getBody();
        Assertions.assertEquals(appSeries, savedAppSeries);
        Assertions.assertNotNull(appSeries.getId());

        Assertions.assertThrows(InvalidParameterException.class,
            () -> appController.createAppointment(appointment));
        appointment.setId(null);
        Appointment savedAppointment = appController.createAppointment(appointment).getBody();
        Assertions.assertEquals(appointment, savedAppointment);
        Assertions.assertNotNull(appointment.getId());

        Assertions.assertThrows(InvalidParameterException.class,
            () -> acceptanceController.createAcceptance(acceptance));
        acceptance.setId(null);
        Acceptance savedAcceptance = acceptanceController.createAcceptance(acceptance).getBody();
        Assertions.assertEquals(acceptance, savedAcceptance);
        Assertions.assertNotNull(acceptance.getId());

    }
}
