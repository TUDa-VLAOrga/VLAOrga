ALTER TABLE appointment_matching
    ADD linus_appointment_time TIMESTAMP WITHOUT TIME ZONE;

ALTER TABLE experiment_bookings
    ALTER COLUMN appointment_id SET NOT NULL;

ALTER TABLE experiment_bookings
ALTER
COLUMN notes TYPE VARCHAR(4096) USING (notes::VARCHAR(4096));