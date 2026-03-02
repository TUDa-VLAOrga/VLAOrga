ALTER TABLE acceptances
    ADD end_time TIMESTAMP WITHOUT TIME ZONE;

ALTER TABLE acceptances
    ADD start_time TIMESTAMP WITHOUT TIME ZONE;

ALTER TABLE acceptances
    ALTER COLUMN end_time SET NOT NULL;

ALTER TABLE acceptances
    ALTER COLUMN start_time SET NOT NULL;


ALTER TABLE acceptances
    DROP COLUMN "end";

ALTER TABLE acceptances
    DROP COLUMN start;
