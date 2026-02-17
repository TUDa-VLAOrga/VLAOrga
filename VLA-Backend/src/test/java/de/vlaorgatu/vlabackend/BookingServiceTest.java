package de.vlaorgatu.vlabackend;

import de.vlaorgatu.vlabackend.entities.linusdb.LinusExperimentBooking;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusExperimentBookingRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Import;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
public class BookingServiceTest {
    @Autowired
    private LinusExperimentBookingRepository linusbookings;

    @PersistenceContext(unitName = "linusEntityManagerFactory")
    private EntityManager linusEntityManager;

    @Transactional("linusTransactionManager")
    @BeforeEach
    void setup() {
        LinusExperimentBooking booking = new LinusExperimentBooking(0, 0, 0, 0, 0, LocalDateTime.of(2026, 1, 1, 0, 0, 0));
        linusEntityManager.persist(booking);
    }

    @Transactional("linusTransactionManager")
    @Test
    void checkCorrectSetup(){
        assertEquals(1, linusbookings.findAll().size());
    }

    @Transactional("linusTransactionManager")
    @Test
    void checkCorrectAfterSecondCall(){
        assertEquals(1, linusbookings.findAll().size());
        assertEquals(0, linusbookings.findAll().getFirst().getId());
        assertEquals(LocalDateTime.of(2026, 1, 1, 0, 0, 0), linusbookings.findAll().getFirst().getPinnedOn());
    }
}