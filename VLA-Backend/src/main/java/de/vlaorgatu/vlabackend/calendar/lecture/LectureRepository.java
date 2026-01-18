package de.vlaorgatu.vlabackend.calendar.lecture;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for accessing and managing {@link Lecture} entities.
 */
@Repository
public interface LectureRepository extends CrudRepository<Lecture, Long> {
}
