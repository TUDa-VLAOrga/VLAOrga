ALTER TABLE appointments
    ADD linus_appointment_id INTEGER;

ALTER TABLE users
    ADD linus_user_id INTEGER;

ALTER TABLE users
    ALTER COLUMN email DROP NOT NULL;