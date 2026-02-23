package de.vlaorgatu.vlabackend.controller.vladb;

import de.vlaorgatu.vlabackend.controller.sse.SseController;
import de.vlaorgatu.vlabackend.entities.vladb.Lecture;
import de.vlaorgatu.vlabackend.exceptions.EntityNotFoundException;
import de.vlaorgatu.vlabackend.exceptions.InvalidParameterException;
import de.vlaorgatu.vlabackend.repositories.vladb.LectureRepository;
import java.util.Objects;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Overrides to the default REST handlers generatey by Spring Data REST.
 * The override is needed mainly to trigger SSE events on update operations.
 */
@AllArgsConstructor
@RestController
@RequestMapping("/api/lectures")
public class LectureController
    implements DefaultGettingForJpaReposInterface<Lecture, LectureRepository> {

    /**
     * Repository used for lecture persistence operations.
     */
    private final LectureRepository lectureRepository;

    /**
     * Creates a new lecture.
     *
     * @param lecture Dataset of the lecture to create. Must not contain an ID (auto-generated).
     * @return OK response with the created lecture, error response otherwise.
     */
    @PostMapping
    public ResponseEntity<?> createLecture(@RequestBody Lecture lecture) {
        if (Objects.nonNull(lecture.getId())) {
            throw new InvalidParameterException(
                "Received lecture with ID " + lecture.getId() + " when creating a new lecture.");
        }

        Lecture savedLecture = lectureRepository.save(lecture);
        // TODO: use a better method here instead of debug message
        SseController.notifyDebugTest("Lecture created: " + savedLecture);
        return ResponseEntity.ok(savedLecture);
    }

    /**
     * Updates an existing lecture.
     *
     * @param id      ID of the lecture to update.
     * @param lecture Dataset of the lecture to update. Must contain all keys, ID may be omitted.
     * @return OK response with the updated lecture, Error response otherwise.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateLecture(@PathVariable Long id, @RequestBody Lecture lecture) {
        if (Objects.isNull(lecture.getId())) {
            lecture.setId(id);
        } else if (!lecture.getId().equals(id)) {
            throw new InvalidParameterException(
                "Received inconsistent IDs on lecture modification. ID from url: " + id +
                    " vs. ID from body data: " + lecture.getId() + ".");
        }
        if (!lectureRepository.existsById(id)) {
            throw new EntityNotFoundException("Lecture with ID " + id + " not found.");
        }

        Lecture updatedLecture = lectureRepository.save(lecture);
        // TODO: use a better method here instead of debug message
        SseController.notifyDebugTest("Lecture updated: " + updatedLecture);
        return ResponseEntity.ok(updatedLecture);
    }

    /**
     * Deletes a lecture by its ID.
     *
     * @param id ID of the lecture to delete.
     * @return OK response with the deleted lecture, Error response otherwise.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLecture(@PathVariable Long id) {
        Lecture deletedLecture = lectureRepository.findById(id).orElseThrow(
            () -> new EntityNotFoundException(
                "Lecture with ID " + id + " not found."));

        lectureRepository.deleteById(id);
        // TODO: use a better method here instead of debug message
        SseController.notifyDebugTest("Lecture deleted: " + deletedLecture);
        return ResponseEntity.ok(deletedLecture);
    }

    /**
     * Retrieves the repository ot this controller instance.
     *
     * @return The JPARepository used by this controller
     */
    @Override
    public LectureRepository getRepository() {
        return lectureRepository;
    }
}
