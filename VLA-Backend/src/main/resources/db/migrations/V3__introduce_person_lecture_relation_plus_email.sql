CREATE TABLE lecture_persons
(
    lecture_id BIGINT NOT NULL,
    person_id  BIGINT NOT NULL,
    CONSTRAINT pk_lecture_persons PRIMARY KEY (lecture_id, person_id)
);

ALTER TABLE persons
    ADD email VARCHAR(255);

ALTER TABLE persons
    ALTER COLUMN email SET NOT NULL;

ALTER TABLE lecture_persons
    ADD CONSTRAINT fk_lecper_on_lecture FOREIGN KEY (lecture_id) REFERENCES lectures (id);

ALTER TABLE lecture_persons
    ADD CONSTRAINT fk_lecper_on_person FOREIGN KEY (person_id) REFERENCES persons (id);
