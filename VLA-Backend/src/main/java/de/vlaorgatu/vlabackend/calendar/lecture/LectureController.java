package de.vlaorgatu.vlabackend.calendar.lecture;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import de.vlaorgatu.vlabackend.exceptions.EntityNotFoundException;
import de.vlaorgatu.vlabackend.sse.SseController;
import java.util.Objects;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Overrides to the default REST handlers generatey by Spring Data REST.
 * The override is needed mainly to trigger SSE events on update operations.
 */
@AllArgsConstructor
@RepositoryRestController
public class LectureController {

    private static final Logger LOGGER = org.slf4j.LoggerFactory.getLogger(LectureController.class);
    private final LectureRepository lectureRepository;

    /**
     * Creates a new lecture.
     *
     * @param lecture Dataset of the lecture to create.
     * @return OK response with the created lecture, error response otherwise.
     */
    @PostMapping("/lectures")
    public ResponseEntity<?> createLecture(@RequestBody Lecture lecture) {
        if (Objects.nonNull(lecture.getId())) {
            // TODO: use exception
            LOGGER.warn("Received lecture with ID {} when creating a new lecture.",
                lecture.getId());
            return ResponseEntity.badRequest().build();
        }

        Lecture savedLecture = lectureRepository.save(lecture);
        // TODO: use a better method here instead of debug message
        SseController.notifyDebugTest("Lecture created: " + savedLecture);

        EntityModel<Lecture> lectureModel = EntityModel.of(savedLecture, linkTo(
            methodOn(LectureController.class).updateLecture(lecture.getId(),
                lecture)).withSelfRel());
        return ResponseEntity.ok(lectureModel);
    }

    /**
     * Updates an existing lecture.
     *
     * @param id      ID of the lecture to update.
     * @param lecture Dataset of the lecture to update. Must contain all keys, ID may be omitted.
     * @return OK response with the updated lecture, Error response otherwise.
     */
    @PutMapping("/lectures/{id}")
    public ResponseEntity<?> updateLecture(@PathVariable Long id, @RequestBody Lecture lecture) {
        if (Objects.isNull(lecture.getId())) {
            lecture.setId(id);
        } else if (!lecture.getId().equals(id)) {
            // TODO: use exception
            LOGGER.warn("Received inconsistent IDs on lecture modification." +
                " ID from url: {} vs. ID from body data: {}.", id, lecture.getId());
            return ResponseEntity.badRequest().build();
        }
        if (!lectureRepository.existsById(id)) {
            throw new EntityNotFoundException("Lecture with ID " + id + " not found.");
        }

        Lecture updatedLecture = lectureRepository.save(lecture);
        // TODO: use a better method here instead of debug message
        SseController.notifyDebugTest("Lecture updated: " + updatedLecture);

        EntityModel<Lecture> lectureModel = EntityModel.of(updatedLecture,
            linkTo(methodOn(LectureController.class).updateLecture(id, lecture)).withSelfRel());
        return ResponseEntity.ok(lectureModel);
    }

    /**
     * Deletes a lecture by its ID.
     *
     * @param id ID of the lecture to delete.
     * @return OK response with the deleted lecture, Error response otherwise.
     */
    @DeleteMapping("/lectures/{id}")
    public ResponseEntity<?> deleteLecture(@PathVariable Long id) {
        Lecture deletedLecture = lectureRepository.findById(id).orElseThrow(
            () -> new EntityNotFoundException("Lecture with ID " + id + " not found."));

        lectureRepository.deleteById(id);
        // TODO: use a better method here instead of debug message
        SseController.notifyDebugTest("Lecture deleted: " + deletedLecture);

        EntityModel<Lecture> lectureModel = EntityModel.of(deletedLecture,
            linkTo(methodOn(LectureController.class).deleteLecture(id)).withSelfRel());
        return ResponseEntity.ok(lectureModel);
    }
}
