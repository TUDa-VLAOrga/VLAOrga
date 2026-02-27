CREATE SEQUENCE IF NOT EXISTS appointment_matching_seq START WITH 1 INCREMENT BY 50;

CREATE TABLE appointment_matching
(
    id                     BIGINT  NOT NULL,
    linus_appointment_id   INTEGER NOT NULL,
    linus_appointment_time TIMESTAMP WITHOUT TIME ZONE,
    appointment_id         BIGINT,
    CONSTRAINT pk_appointmentmatching PRIMARY KEY (id)
);

ALTER TABLE appointments
    ADD end_time TIMESTAMP WITHOUT TIME ZONE;

ALTER TABLE appointments
    ADD start_time TIMESTAMP WITHOUT TIME ZONE;

ALTER TABLE appointments
    ALTER COLUMN end_time SET NOT NULL;

ALTER TABLE persons
    ADD linus_user_name VARCHAR(255);

ALTER TABLE appointments
    ALTER COLUMN start_time SET NOT NULL;

ALTER TABLE appointment_matching
    ADD CONSTRAINT uc_appointmentmatching_appointment UNIQUE (appointment_id);

ALTER TABLE appointment_matching
    ADD CONSTRAINT uc_appointmentmatching_linus_appointment UNIQUE (linus_appointment_id);

ALTER TABLE persons
    ADD CONSTRAINT uc_persons_linus_user UNIQUE (linus_user_id);

ALTER TABLE persons
    ADD CONSTRAINT uc_persons_linus_user_name UNIQUE (linus_user_name);

ALTER TABLE appointment_matching
    ADD CONSTRAINT FK_APPOINTMENTMATCHING_ON_APPOINTMENT FOREIGN KEY (appointment_id) REFERENCES appointments (id);

ALTER TABLE appointments
DROP
COLUMN "end";

ALTER TABLE appointments
DROP
COLUMN start;

ALTER TABLE experiment_bookings
    ALTER COLUMN appointment_id SET NOT NULL;

ALTER TABLE users
    ALTER COLUMN email DROP NOT NULL;

ALTER TABLE persons
DROP
COLUMN linus_user_id;

ALTER TABLE persons
    ADD linus_user_id INTEGER;

ALTER TABLE persons
    ADD CONSTRAINT uc_persons_linus_user UNIQUE (linus_user_id);

ALTER TABLE experiment_bookings
ALTER
COLUMN notes TYPE VARCHAR(4096) USING (notes::VARCHAR(4096));