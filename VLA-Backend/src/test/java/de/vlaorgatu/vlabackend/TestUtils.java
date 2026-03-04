package de.vlaorgatu.vlabackend;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.ArrayList;
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
     * Populates linus with the specified entities.
     * Should be Linus entities
     */
    @Transactional("linusTransactionManager")
    void populateLinusDb(ArrayList<Object> linusEntities) {
        linusDisableFkChecks();

        linusEntities.forEach(linusEntityManager::merge);
        linusEntityManager.flush();

        linusEnableFkChecks();
    }
}
