CREATE TABLE appointment_series_appointments
(
    appointment_series_id BIGINT NOT NULL,
    appointments_id       BIGINT NOT NULL
);

CREATE TABLE users_appointments
(
    user_id         BIGINT NOT NULL,
    appointments_id BIGINT NOT NULL
);

ALTER TABLE appointments
    ADD deleting_intention_user_id BIGINT;

ALTER TABLE appointments
    ADD end_time TIMESTAMP WITHOUT TIME ZONE;

ALTER TABLE appointments
    ADD start_time TIMESTAMP WITHOUT TIME ZONE;

ALTER TABLE appointments
    ALTER COLUMN end_time SET NOT NULL;

ALTER TABLE appointments
    ALTER COLUMN start_time SET NOT NULL;

ALTER TABLE appointment_series_appointments
    ADD CONSTRAINT uc_appointment_series_appointments_appointments UNIQUE (appointments_id);

ALTER TABLE users_appointments
    ADD CONSTRAINT uc_users_appointments_appointments UNIQUE (appointments_id);

ALTER TABLE appointments
    ADD CONSTRAINT FK_APPOINTMENTS_ON_DELETINGINTENTIONUSER FOREIGN KEY (deleting_intention_user_id) REFERENCES users (id);

ALTER TABLE appointment_series_appointments
    ADD CONSTRAINT fk_appserapp_on_appointment FOREIGN KEY (appointments_id) REFERENCES appointments (id);

ALTER TABLE appointment_series_appointments
    ADD CONSTRAINT fk_appserapp_on_appointment_series FOREIGN KEY (appointment_series_id) REFERENCES appointment_series (id);

ALTER TABLE users_appointments
    ADD CONSTRAINT fk_useapp_on_appointment FOREIGN KEY (appointments_id) REFERENCES appointments (id);

ALTER TABLE users_appointments
    ADD CONSTRAINT fk_useapp_on_user FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE appointments
DROP
COLUMN "end";

ALTER TABLE appointments
DROP
COLUMN start;