package de.vlaorgatu.vlabackend.calendar.lecture;

import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * REST endpoints for managing {@link Lecture} entities.
 */
@RestController
@RequestMapping("/api/calendar/lecture")
class LectureController {

    private final LectureRepository lectureRepository;

    public LectureController(LectureRepository lectureRepository) {
        this.lectureRepository = lectureRepository;
    }

    /**
     * List all lectures.
     */
    @GetMapping()
    public List<Lecture> listLectures() {
        return lectureRepository.findAll();
    }

    /**
     * Get a lecture by id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Lecture> getLectureById(@PathVariable Long id) {
        return lectureRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Create a new lecture.
     *
     * @return The newly created lecture.
     */
    @PostMapping
    public Lecture createLecture(@RequestBody Lecture lecture) {
        return lectureRepository.save(lecture);
    }

    /**
     * Update an existing lecture.
     *
     * @param id      ID of the lecture to update
     * @param lecture The new lecture dataset.
     * @return The updated lecture
     */
    @PutMapping("/{id}")
    public ResponseEntity<Lecture> updateLecture(
            @PathVariable Long id, @RequestBody Lecture lecture
    ) {
        Optional<Lecture> exists = lectureRepository.findById(id);
        if (exists.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Lecture existingLecture = exists.get();
        existingLecture.setTitle(lecture.getTitle());
        existingLecture.setSemester(lecture.getSemester());
        existingLecture.setColor(lecture.getColor());

        return ResponseEntity.ok(lectureRepository.save(existingLecture));
    }

    /**
     * Delete a lecture.
     *
     * @param id ID of the lecture to delete.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLecture(@PathVariable Long id) {
        if (!lectureRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        lectureRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
