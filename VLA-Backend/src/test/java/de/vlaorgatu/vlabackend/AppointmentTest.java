package de.vlaorgatu.vlabackend;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentCategory;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentSeries;
import de.vlaorgatu.vlabackend.entities.vladb.ExperimentBooking;
import de.vlaorgatu.vlabackend.enums.calendar.experimentbooking.ExperimentPreparationStatus;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentCategoryRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentSeriesRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.ExperimentBookingRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;

/**
 * Tests for the appointment endpoint.
 */
@Import(TestcontainersConfiguration.class)
@AutoConfigureMockMvc
@SpringBootTest
@Transactional
public class AppointmentTest {
    /**
     * The MVC mock for requesting.
     */
    @Autowired
    private MockMvc mockMvc;

    /**
     * The repository of {@link AppointmentCategory}.
     */
    @Autowired
    private AppointmentCategoryRepository appointmentCategoryRepository;

    /**
     * The repository of {@link AppointmentSeries}.
     */
    @Autowired
    private AppointmentSeriesRepository appointmentSeriesRepository;

    /**
     * The repository of {@link Appointment}.
     */
    @Autowired
    private AppointmentRepository appointmentRepository;

    /**
     * The repository of {@link ExperimentBooking}.
     */
    @Autowired
    private ExperimentBookingRepository experimentBookingRepository;

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
            MvcResult result =
                mockMvc
                    .perform(MockMvcRequestBuilders.get("/api/appointments"))
                    .andExpect(status().isOk())
                    .andReturn();

            String jsonResponse = result.getResponse().getContentAsString();

            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());

            List<Appointment> appointments =
                objectMapper.readValue(
                    jsonResponse,
                    new TypeReference<List<Appointment>>() {
                    }
                );

            Assertions.assertEquals(1, appointments.size());
            Assertions.assertEquals(appointment.getNotes(), appointments.getFirst().getNotes());
        } catch (Exception e) {
            Assertions.fail(e);
        }
    }

    @Test
    public void testAppointmentManyToOne() {
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

        ExperimentBooking experimentBooking = ExperimentBooking.builder()
            .id(null)
            .appointment(appointment)
            .linusExperimentId(1)
            .linusExperimentBookingId(1)
            .person(null)
            .notes("Experiment note")
            .status(ExperimentPreparationStatus.PENDING)
            .build();

        appointment.setBookings(List.of(experimentBooking));

        appointmentRepository.save(appointment);
        experimentBookingRepository.save(experimentBooking);

        try {
            MvcResult result =
                mockMvc
                    .perform(MockMvcRequestBuilders.get("/api/appointments"))
                    .andExpect(status().isOk())
                    .andReturn();

            String jsonResponse = result.getResponse().getContentAsString();

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(jsonResponse);
            ObjectWriter writer = objectMapper.writerWithDefaultPrettyPrinter();
            String prettyJson = writer.writeValueAsString(jsonNode);

            Assertions.assertEquals(jsonNode.get(0).get("bookings").size(), 1);

            System.out.println(prettyJson);
        } catch (Exception e) {
            Assertions.fail(e);
        }
    }
}
