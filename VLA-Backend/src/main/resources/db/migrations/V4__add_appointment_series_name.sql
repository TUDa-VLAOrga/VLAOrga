ALTER TABLE appointment_series
    ADD name VARCHAR(255);

ALTER TABLE appointment_series
    ALTER COLUMN name SET NOT NULL;
