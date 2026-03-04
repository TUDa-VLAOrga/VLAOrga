package de.vlaorgatu.vlabackend;

<<<<<<< HEAD
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusAppointmentRepository;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusExperimentBookingRepository;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusExperimentRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentCategoryRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentMatchingRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentSeriesRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.ExperimentBookingRepository;
=======
>>>>>>> main
import jakarta.persistence.Entity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.metamodel.EntityType;
<<<<<<< HEAD
import java.util.ArrayList;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
=======
import java.util.Set;
>>>>>>> main
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Class that offers utility functions for testing purposes.
 */
@Service
public class TestUtils {
    /**
<<<<<<< HEAD
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
=======
>>>>>>> main
     * Entity manager for manipulating the vla db.
     */
    @PersistenceContext(unitName = "vlaEntityManagerFactory")
    private EntityManager vlaEntityManager;

    /**
<<<<<<< HEAD
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
=======
     * Entity manager for manipulating the linus db.
     */
    @PersistenceContext(unitName = "linusEntityManagerFactory")
    private EntityManager linusEntityManager;

    /**
     * Disables foreign key checks for Vla db.
     */
    private void vlaDisableFkChecks() {
        vlaEntityManager.createNativeQuery(
                "SET session_replication_role = 'replica';")
            .executeUpdate();
    }

    /**
     * Enables foreign key checks for Vla db.
     */
    private void vlaEnableFkChecks() {
        vlaEntityManager.createNativeQuery(
                "SET session_replication_role = 'origin';")
            .executeUpdate();
    }

    /**
     * Disables foreign key checks for linus db.
     */
    private void linusDisableFkChecks() {
        linusEntityManager.createNativeQuery(
                "SET FOREIGN_KEY_CHECKS = 0;")
            .executeUpdate();
    }

    /**
     * Enable foreign key checks for linus db.
     */
    private void linusEnableFkChecks() {
        linusEntityManager.createNativeQuery(
                "SET FOREIGN_KEY_CHECKS = 1;")
            .executeUpdate();
>>>>>>> main
    }

    /**
     * Deletes all entities in the vla db.
<<<<<<< HEAD
     */
    @Transactional("vlaTransactionManager")
    public void clearVlaDb() {
=======
     * This should only be called in a sequential testing context!
     */
    @Transactional("vlaTransactionManager")
    public void clearVlaDb() {
        vlaEntityManager.flush();
        vlaEntityManager.clear();

        vlaDisableFkChecks();

>>>>>>> main
        Set<EntityType<?>> entities = vlaEntityManager.getMetamodel().getEntities();

        for (EntityType<?> entityType : entities) {
            Class<?> javaType = entityType.getJavaType();
            if (javaType.isAnnotationPresent(Entity.class)) {
                String entityName = entityType.getName();
                vlaEntityManager.createQuery("DELETE FROM " + entityName).executeUpdate();
            }
        }
<<<<<<< HEAD
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
=======

        vlaEnableFkChecks();
    }

    /**
     * Deletes all entities in the linus db.
     * If you only use one db, use @Transactional("name of correct TransactionManager")
     * This should only be called in a sequential testing context!
     */
    @Transactional("linusTransactionManager")
    public void clearLinusDb() {
        linusEntityManager.flush();
        linusEntityManager.clear();

        Set<EntityType<?>> entities = linusEntityManager.getMetamodel().getEntities();

        linusDisableFkChecks();

        for (EntityType<?> entityType : entities) {
            Class<?> javaType = entityType.getJavaType();
            if (javaType.isAnnotationPresent(Entity.class)) {
                String entityName = entityType.getName();
                linusEntityManager.createQuery("DELETE FROM " + entityName).executeUpdate();
            }
        }

        linusEnableFkChecks();
>>>>>>> main
    }
}
