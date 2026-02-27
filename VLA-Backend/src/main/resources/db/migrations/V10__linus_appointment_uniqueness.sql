ALTER TABLE appointment_matching
    ADD CONSTRAINT uc_appointmentmatching_linus_appointment UNIQUE (linus_appointment_id);