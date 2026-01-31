package de.vlaorgatu.vlabackend.calendar.lecture;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import de.vlaorgatu.vlabackend.sse.SseController;
import de.vlaorgatu.vlabackend.sse.SseMessageType;
import java.util.Objects;
import java.util.Optional;
import lombok.AllArgsConstructor;
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
class LectureController {

    private final LectureRepository lectureRepository;

    @PostMapping("/lectures")
    public ResponseEntity<?> createLecture(@RequestBody Lecture lecture) {
        if (Objects.nonNull(lecture.getId())) {
            return ResponseEntity.badRequest().build();
        }

        Lecture savedLecture = lectureRepository.save(lecture);
        SseController.notifyDebugTest(SseMessageType.LECTURE_CREATED,
            savedLecture.getId().toString());

        EntityModel<Lecture> lectureModel = EntityModel.of(savedLecture, linkTo(
            methodOn(LectureController.class).updateLecture(lecture.getId(),
                lecture)).withSelfRel());
        return ResponseEntity.ok(lectureModel);
    }

    @PutMapping("/lectures/{id}")
    public ResponseEntity<?> updateLecture(@PathVariable Long id, @RequestBody Lecture lecture) {
        if (Objects.isNull(lecture.getId())) {
            lecture.setId(id);
        } else if (!lecture.getId().equals(id)) {
            return ResponseEntity.badRequest().build();
        }
        if (!lectureRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        Lecture updatedLecture = lectureRepository.save(lecture);
        SseController.notifyDebugTest(SseMessageType.DEBUG, "Lecture updated: " + updatedLecture);

        EntityModel<Lecture> lectureModel = EntityModel.of(updatedLecture,
            linkTo(methodOn(LectureController.class).updateLecture(id, lecture)).withSelfRel());
        return ResponseEntity.ok(lectureModel);
    }

    @DeleteMapping("/lectures/{id}")
    public ResponseEntity<?> deleteLecture(@PathVariable Long id) {
        Optional<Lecture> lectureOptional = lectureRepository.findById(id);
        if (lectureOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        lectureRepository.deleteById(id);
        SseController.notifyDebugTest(SseMessageType.DEBUG,
            "Lecture deleted: " + lectureOptional.get());

        EntityModel<Lecture> lectureModel = EntityModel.of(lectureOptional.get(),
            linkTo(methodOn(LectureController.class).deleteLecture(id)).withSelfRel());
        return ResponseEntity.ok(lectureModel);
    }
}
