CREATE TABLE appointment_series_appointments
(
    appointment_series_id BIGINT NOT NULL,
    appointments_id       BIGINT NOT NULL
);

CREATE TABLE users_appointments_with_deletion_intention
(
    user_id                                 BIGINT NOT NULL,
    appointments_with_deletion_intention_id BIGINT NOT NULL
);

ALTER TABLE appointments
    ADD deleting_intention_user_id BIGINT;

ALTER TABLE appointment_series_appointments
    ADD CONSTRAINT uc_appointment_series_appointments_appointments UNIQUE (appointments_id);

ALTER TABLE users_appointments_with_deletion_intention
    ADD CONSTRAINT uc_usersappointmentswithdeletion_appointmentswithdeletioninten UNIQUE (appointments_with_deletion_intention_id);

ALTER TABLE appointments
    ADD CONSTRAINT FK_APPOINTMENTS_ON_DELETINGINTENTIONUSER FOREIGN KEY (deleting_intention_user_id) REFERENCES users (id);

ALTER TABLE appointment_series_appointments
    ADD CONSTRAINT fk_appserapp_on_appointment FOREIGN KEY (appointments_id) REFERENCES appointments (id);

ALTER TABLE appointment_series_appointments
    ADD CONSTRAINT fk_appserapp_on_appointment_series FOREIGN KEY (appointment_series_id) REFERENCES appointment_series (id);

ALTER TABLE users_appointments_with_deletion_intention
    ADD CONSTRAINT fk_useappwitdelint_on_appointment FOREIGN KEY (appointments_with_deletion_intention_id) REFERENCES appointments (id);

ALTER TABLE users_appointments_with_deletion_intention
    ADD CONSTRAINT fk_useappwitdelint_on_user FOREIGN KEY (user_id) REFERENCES users (id);