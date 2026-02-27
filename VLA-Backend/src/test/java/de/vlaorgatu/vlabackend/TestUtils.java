package de.vlaorgatu.vlabackend;

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
     * Entity manager for manipulating the vla db.
     */
    @PersistenceContext(unitName = "vlaEntityManagerFactory")
    private EntityManager vlaEntityManager;

    /**
     * Deletes all entities in the vla db.
     */
    @Transactional("vlaTransactionManager")
    public void clearVlaDb() {
        Set<EntityType<?>> entities = vlaEntityManager.getMetamodel().getEntities();

        vlaEntityManager.createNativeQuery(
            "SET session_replication_role = 'replica';")
            .executeUpdate();

        for (EntityType<?> entityType : entities) {
            Class<?> javaType = entityType.getJavaType();
            if (javaType.isAnnotationPresent(Entity.class)) {
                String entityName = entityType.getName();
                vlaEntityManager.createQuery("DELETE FROM " + entityName).executeUpdate();
            }
        }

        vlaEntityManager.createNativeQuery(
                "SET session_replication_role = 'origin';")
            .executeUpdate();
    }
}
