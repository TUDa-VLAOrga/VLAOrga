package de.vlaorgatu.vlabackend;

import de.vlaorgatu.vlabackend.entities.calendar.acceptance.Acceptance;
import de.vlaorgatu.vlabackend.entities.calendar.acceptance.AcceptanceController;
import de.vlaorgatu.vlabackend.entities.calendar.appointment.Appointment;
import de.vlaorgatu.vlabackend.entities.calendar.appointment.AppointmentController;
import de.vlaorgatu.vlabackend.entities.calendar.appointmentcategory.AppointmentCategory;
import de.vlaorgatu.vlabackend.entities.calendar.appointmentcategory.AppointmentCategoryController;
import de.vlaorgatu.vlabackend.entities.calendar.appointmentseries.AppointmentSeries;
import de.vlaorgatu.vlabackend.entities.calendar.appointmentseries.AppointmentSeriesController;
import de.vlaorgatu.vlabackend.entities.calendar.lecture.Lecture;
import de.vlaorgatu.vlabackend.entities.calendar.lecture.LectureController;
import de.vlaorgatu.vlabackend.entities.calendar.person.Person;
import de.vlaorgatu.vlabackend.entities.calendar.person.PersonController;
import de.vlaorgatu.vlabackend.exceptions.InvalidParameterException;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

/**
 * Tests for backend entity operations, using the Controller classes.
 */
@Import(TestcontainersConfiguration.class)
@SpringBootTest
public class VlaBackendEntitiesTest {

    // Sample Data
    Lecture lecture = new Lecture(1L, "Physik 1", "WS 25/26", "#FFFF00");
    Person person = new Person(1L, "Dr. Alberner Stein", "bitte grünen Laserpointer", 42L);
    AppointmentCategory appCategory = new AppointmentCategory(1L, "Vorlesung");
    AppointmentSeries appSeries = new AppointmentSeries(1L, lecture, appCategory);
    Appointment appointment =
        new Appointment(1L, appSeries, LocalDateTime.parse("2025-10-14T09:50:00"),
            LocalDateTime.parse("2025-10-14T11:30:00"),
            "Mit Willkommensgeschenk zum Semesterstart!");
    Acceptance acceptance =
        new Acceptance(1L, appointment, LocalDateTime.parse("2025-10-13T17:00:00"),
            LocalDateTime.parse("2025-10-13T17:30:00"));

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

    @Test
    void entityCreationTest() {
        Assertions.assertThrows(InvalidParameterException.class,
            () -> lectureController.createLecture(lecture));
        lecture.setId(null);
        Lecture responseLecture = lectureController.createLecture(lecture).getBody();
        Assertions.assertEquals(lecture, responseLecture);
        Assertions.assertEquals(1L, lecture.getId());  // got set on saving

        // empty datasets are filled with default (empty string)
        Lecture emptyLecture = new Lecture();
        Lecture emptyExpected = new Lecture(2L, "", "", "");
        Assertions.assertEquals(emptyExpected,
            lectureController.createLecture(emptyLecture).getBody());

        Assertions.assertThrows(InvalidParameterException.class,
            () -> personController.createPerson(person));
        person.setId(null);
        Person savedPerson = personController.createPerson(person).getBody();
        Assertions.assertEquals(person, savedPerson);
        Assertions.assertEquals(1L, person.getId());

        Assertions.assertThrows(InvalidParameterException.class,
            () -> appCatController.createAppointmentCategory(appCategory));
        appCategory.setId(null);
        AppointmentCategory savedAppCat =
            appCatController.createAppointmentCategory(appCategory).getBody();
        Assertions.assertEquals(appCategory, savedAppCat);
        Assertions.assertEquals(1L, appCategory.getId());

        Assertions.assertThrows(InvalidParameterException.class,
            () -> appSeriesController.createAppointmentSeries(appSeries));
        appSeries.setId(null);
        AppointmentSeries savedAppSeries =
            appSeriesController.createAppointmentSeries(appSeries).getBody();
        Assertions.assertEquals(appSeries, savedAppSeries);
        Assertions.assertEquals(1L, appSeries.getId());

        Assertions.assertThrows(InvalidParameterException.class,
            () -> appController.createAppointment(appointment));
        appointment.setId(null);
        Appointment savedAppointment = appController.createAppointment(appointment).getBody();
        Assertions.assertEquals(appointment, savedAppointment);
        Assertions.assertEquals(1L, appointment.getId());

        Assertions.assertThrows(InvalidParameterException.class,
            () -> acceptanceController.createAcceptance(acceptance));
        acceptance.setId(null);
        Acceptance savedAcceptance = acceptanceController.createAcceptance(acceptance).getBody();
        Assertions.assertEquals(acceptance, savedAcceptance);
        Assertions.assertEquals(1L, acceptance.getId());

    }
}
