ALTER TABLE appointments
    ADD deleting_intention_user_id BIGINT;

ALTER TABLE appointments
    ADD CONSTRAINT FK_APPOINTMENTS_ON_DELETINGINTENTIONUSER FOREIGN KEY (deleting_intention_user_id) REFERENCES users (id);