package de.vlaorgatu.vlabackend.calendar.lecture;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import java.util.Objects;
import lombok.AllArgsConstructor;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@AllArgsConstructor
@RepositoryRestController
class LectureController {

    private final LectureRepository lectureRepository;

    @PutMapping("/lectures/{id}")
    public ResponseEntity<?> updateLecture(@PathVariable Long id, @RequestBody Lecture lecture) {
        if (Objects.isNull(lecture.getId())) {
            lecture.setId(id);
        } else if (!lecture.getId().equals(id)) {
            return ResponseEntity.badRequest().build();
        }
        Lecture updatedLecture = lectureRepository.save(lecture);
        // TODO: sse notification

        EntityModel<Lecture> lectureModel = EntityModel.of(updatedLecture);
        lectureModel.add(
            linkTo(methodOn(LectureController.class).updateLecture(id, lecture)).withSelfRel());
        return ResponseEntity.ok(lectureModel);
    }

}
