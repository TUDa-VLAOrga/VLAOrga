package de.vlaorgatu.vlabackend;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentCategory;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentSeries;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentCategoryRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentSeriesRepository;
import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;

@Import(TestcontainersConfiguration.class)
@AutoConfigureMockMvc
@SpringBootTest
@Transactional
public class AppointmentTest {
    @Autowired
    private MockMvc mockMvc;

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

        try {
            mockMvc
                .perform(MockMvcRequestBuilders.get("/api/appointments"))
                .andExpect(status().isOk())
            ;
        } catch (Exception e) {
            Assertions.fail(e);
        }
    }
}
