package de.vlaorgatu.vlabackend.repositories.vladb;

import de.vlaorgatu.vlabackend.entities.vladb.Acceptance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for accessing and managing {@link Acceptance} entities.
 */
@Repository
public interface AcceptanceRepository extends JpaRepository<Acceptance, Long> {
}
