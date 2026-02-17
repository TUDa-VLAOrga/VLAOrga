package de.vlaorgatu.vlabackend.repositories.vladb;

import de.vlaorgatu.vlabackend.entities.vladb.AppointmentCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for accessing and managing {@link AppointmentCategory} entities.
 */
@Repository
public interface AppointmentCategoryRepository extends JpaRepository<AppointmentCategory, Long> {
}
