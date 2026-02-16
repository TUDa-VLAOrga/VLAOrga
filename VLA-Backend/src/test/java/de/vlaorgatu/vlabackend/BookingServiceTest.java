package de.vlaorgatu.vlabackend;

import de.vlaorgatu.vlabackend.linusconnection.LinusExperimentBooking;
import de.vlaorgatu.vlabackend.linusconnection.LinusExperimentBookingRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Import;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@Import(TestConfiguration.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class BookingServiceTest {
    @Autowired
    private EntityManager ;

    @Autowired
    private LinusExperimentBookingRepository linusbookings;

    @BeforeAll
    void setup(){
        LinusExperimentBooking booking = new LinusExperimentBooking(0,0,0,0,0, LocalDateTime.MIN);
        linusEntityManager.persist(booking);
        linusEntityManager.flush();
    }

    @Test
    void checkPresence(){
        assertEquals(1, linusbookings.findAll().size());
    }
}