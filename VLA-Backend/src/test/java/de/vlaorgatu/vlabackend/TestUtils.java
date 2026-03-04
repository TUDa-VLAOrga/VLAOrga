package de.vlaorgatu.vlabackend;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Class that offers utility functions for testing purposes.
 */
@Service
public class TestUtils {
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
    }

    /**
     * Deletes all entities in the vla db.
     * This should only be called in a sequential testing context!
     */
    @Transactional("vlaTransactionManager")
    public void clearVlaDb() {
        vlaEntityManager.flush();
        vlaEntityManager.clear();

        vlaDisableFkChecks();

        Set<EntityType<?>> entities = vlaEntityManager.getMetamodel().getEntities();

        for (EntityType<?> entityType : entities) {
            Class<?> javaType = entityType.getJavaType();
            if (javaType.isAnnotationPresent(Entity.class)) {
                String entityName = entityType.getName();
                vlaEntityManager.createQuery("DELETE FROM " + entityName).executeUpdate();
            }
        }

        vlaEnableFkChecks();
    }

    /**
     * Populates linus with the specified entities.
     * Should be Linus entities
     */
    @Transactional("linusTransactionManager")
    void populateLinusDb(ArrayList<Object> linusEntities) {
        linusDisableFkChecks();

        linusEntities.forEach(linusEntityManager::persist);
        linusEntityManager.flush();

        linusEnableFkChecks();
    }

    /**
     * Populates the vla db with the specified entities.
     * Should be VLA entities
     */
    @Transactional("vlaTransactionManager")
    void populateVlaDb(ArrayList<Object> vlaEntities) {
        vlaDisableFkChecks();

        vlaEntities.forEach(vlaEntityManager::persist);
        vlaEntityManager.flush();

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

        linusDisableFkChecks();

        Set<EntityType<?>> entities = linusEntityManager.getMetamodel().getEntities();

        for (EntityType<?> entityType : entities) {
            Class<?> javaType = entityType.getJavaType();
            if (javaType.isAnnotationPresent(Entity.class)) {
                String entityName = entityType.getName();
                linusEntityManager.createQuery("DELETE FROM " + entityName).executeUpdate();
            }
        }

        linusEnableFkChecks();
    }
}
