package de.vlaorgatu.vlabackend;

import de.vlaorgatu.vlabackend.entities.linusdb.LinusAppointment;
import de.vlaorgatu.vlabackend.entities.linusdb.LinusExperiment;
import de.vlaorgatu.vlabackend.entities.linusdb.LinusExperimentBooking;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusAppointmentRepository;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusExperimentBookingRepository;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusExperimentRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentCategoryRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentMatchingRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentSeriesRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.ExperimentBookingRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TestUtils {
    /**
     * Repository for the appropriate entity.
     */
    @Autowired
    private LinusAppointmentRepository linusAppointmentRepository;

    /**
     * Repository for the appropriate entity.
     */
    @Autowired
    private LinusExperimentBookingRepository linusExperimentBookingRepository;

    /**
     * Repository for the appropriate entity.
     */
    @Autowired
    private LinusExperimentRepository linusExperimentRepository;

    /**
     * Repository for the appropriate entity.
     */
    @Autowired
    private AppointmentMatchingRepository appointmentMatchingRepository;

    /**
     * Repository for the appropriate entity.
     */
    @Autowired
    private AppointmentCategoryRepository appointmentCategoryRepository;

    /**
     * Repository for the appropriate entity.
     */
    @Autowired
    private AppointmentSeriesRepository appointmentSeriesRepository;

    /**
     * Repository for the appropriate entity.
     */
    @Autowired
    private AppointmentRepository appointmentRepository;

    /**
     * Repository for the appropriate entity.
     */
    @Autowired
    private ExperimentBookingRepository experimentBookingRepository;

    /**
     * Entity manager for manipulating read-only linus-db.
     */
    @PersistenceContext(unitName = "linusEntityManagerFactory")
    private EntityManager linusEntityManager;

    @PersistenceContext(unitName = "vlaEntityManagerFactory")
    private EntityManager vlaEntityManager;

    @Transactional("linusTransactionManager")
    void clearLinusDb() {
        linusEntityManager.clear();
    }

    @Transactional("vlaTransactionManager")
    void clearVlaDb() {
        vlaEntityManager.clear();
    }

    @Transactional("linusTransactionManager")
    void populateLinusDb(ArrayList<Object> linusEntities){
        linusEntities.forEach(linusEntityManager::persist);
        linusEntityManager.flush();
    }

    @Transactional("vlaTransactionManager")
    void populateVlaDb(ArrayList<Object> vlaEntities){
        vlaEntities.forEach(vlaEntityManager::persist);
        vlaEntityManager.flush();
    }
}
