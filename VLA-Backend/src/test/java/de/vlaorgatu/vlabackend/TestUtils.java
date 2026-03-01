package de.vlaorgatu.vlabackend;

import de.vlaorgatu.vlabackend.repositories.linusdb.LinusAppointmentRepository;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusExperimentBookingRepository;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusExperimentRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentCategoryRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentMatchingRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentSeriesRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.ExperimentBookingRepository;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Class that offers utility functions for testing purposes.
 */
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

    /**
     * Entity manager for manipulating the vla db.
     */
    @PersistenceContext(unitName = "vlaEntityManagerFactory")
    private EntityManager vlaEntityManager;

    /**
     * Deletes all entities in linus.
     */
    @Transactional("linusTransactionManager")
    public void clearLinusDb() {
        Set<EntityType<?>> entities = linusEntityManager.getMetamodel().getEntities();

        for (EntityType<?> entityType : entities) {
            Class<?> javaType = entityType.getJavaType();
            if (javaType.isAnnotationPresent(Entity.class)) {
                String entityName = entityType.getName();
                linusEntityManager.createQuery("DELETE FROM " + entityName).executeUpdate();
            }
        }
    }

    /**
     * Deletes all entities in the vla db.
     */
    @Transactional("vlaTransactionManager")
    public void clearVlaDb() {
        Set<EntityType<?>> entities = vlaEntityManager.getMetamodel().getEntities();

        for (EntityType<?> entityType : entities) {
            Class<?> javaType = entityType.getJavaType();
            if (javaType.isAnnotationPresent(Entity.class)) {
                String entityName = entityType.getName();
                vlaEntityManager.createQuery("DELETE FROM " + entityName).executeUpdate();
            }
        }
    }

    /**
     * Populates linus with the specified entities.
     * Should be Linus entities
     * If you get database errors, check that they are inserted according to their dependencies.
     */
    @Transactional("linusTransactionManager")
    void populateLinusDb(ArrayList<Object> linusEntities) {
        linusEntities.forEach(linusEntityManager::persist);
        linusEntityManager.flush();
    }

    /**
     * Populates the vla db with the specified entities.
     * Should be VLA entities
     */
    @Transactional("vlaTransactionManager")
    void populateVlaDb(ArrayList<Object> vlaEntities) {
        vlaEntities.forEach(vlaEntityManager::persist);
        vlaEntityManager.flush();
    }
}
