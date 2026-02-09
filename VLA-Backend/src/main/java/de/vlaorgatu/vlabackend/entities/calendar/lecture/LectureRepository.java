package de.vlaorgatu.vlabackend.entities.calendar.lecture;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for accessing and managing {@link Lecture} entities.
 */
@Repository
public interface LectureRepository extends JpaRepository<Lecture, Long> {
}
