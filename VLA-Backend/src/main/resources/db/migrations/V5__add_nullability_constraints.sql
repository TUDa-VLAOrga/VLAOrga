ALTER TABLE acceptances
    ALTER COLUMN appointment_id SET NOT NULL;

ALTER TABLE appointment_series
    ALTER COLUMN category_id SET NOT NULL;

ALTER TABLE users
    ALTER COLUMN email SET NOT NULL;

ALTER TABLE acceptances
    ALTER COLUMN "end" SET NOT NULL;

ALTER TABLE experiment_bookings
    ALTER COLUMN linus_experiment_id SET NOT NULL;

ALTER TABLE users
    ALTER COLUMN name SET NOT NULL;

ALTER TABLE appointments
    ALTER COLUMN series_id SET NOT NULL;

ALTER TABLE acceptances
    ALTER COLUMN start SET NOT NULL;

ALTER TABLE experiment_bookings
    ALTER COLUMN status SET NOT NULL;
