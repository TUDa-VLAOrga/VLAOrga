package de.vlaorgatu.vlabackend;

import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentCategory;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentSeries;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentCategoryRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentSeriesRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
public class AppointmentTest {
    @Autowired
    private AppointmentCategoryRepository appointmentCategoryRepository;

    @Autowired
    private AppointmentSeriesRepository appointmentSeriesRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Test
    public void testCreateAppointment() {
        AppointmentCategory appointmentCategory = AppointmentCategory.builder()
            .title("Category")
            .build();
        appointmentCategoryRepository.save(appointmentCategory);

        AppointmentSeries appointmentSeries = AppointmentSeries.builder()
            .name("Seriesname")
            .category(appointmentCategory)
            .build();
        appointmentSeriesRepository.save(appointmentSeries);

        Appointment appointment = Appointment.builder()
            .series(appointmentSeries)
            .start(LocalDateTime.of(2026, 1, 1, 0, 0))
            .end(LocalDateTime.of(2026, 1, 1, 1, 0))
            .notes("Note that.")
            .bookings(List.of())
            .build();

        appointmentRepository.save(appointment);
        Assertions.assertEquals(1, appointmentRepository.count());
    }

    @Test
    public void testEmpty() {
        Assertions.assertEquals(0, appointmentRepository.count());
    }
}
