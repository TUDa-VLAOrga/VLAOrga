package de.vlaorgatu.vlabackend.calendar.appointmentcategory;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for accessing and managing {@link AppointmentCategory} entities.
 */
@Repository
public interface AppointmentCategoryRepository extends CrudRepository<AppointmentCategory, Long> {
}
