package de.vlaorgatu.vlabackend;

import de.vlaorgatu.vlabackend.databaseSync.LinusSyncService;
import de.vlaorgatu.vlabackend.entities.calendar.experimentbooking.ExperimentBooking;
import de.vlaorgatu.vlabackend.entities.calendar.experimentbooking.ExperimentBookingRepository;
import de.vlaorgatu.vlabackend.linusconnection.LinusExperimentBooking;
import de.vlaorgatu.vlabackend.linusconnection.LinusExperimentBookingRepository;
import jakarta.persistence.EntityManager;
import org.aspectj.lang.annotation.Before;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.repository.CrudRepository;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.stereotype.Repository;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class BookingServiceTest {
    @Autowired
    private LinusExperimentBookingRepository linusbookings;

    @BeforeAll
    void populateLinusOnce() {
        linusbookings.
    }

    @BeforeAll
    void setup(){
        vlaexperiments.deleteAll();
        linusexperiments.deleteAll();
    }
}

@Repository
interface TestLinusExperimentBookingRepository
        extends CrudRepository<LinusExperimentBooking, Long> {}