-- auto-generated migration by JPABuddy / flyway in IntelliJ
ALTER TABLE acceptances
    ADD end_time TIMESTAMP WITHOUT TIME ZONE;

ALTER TABLE acceptances
    ADD start_time TIMESTAMP WITHOUT TIME ZONE;

ALTER TABLE appointments
    ADD end_time TIMESTAMP WITHOUT TIME ZONE;

ALTER TABLE appointments
    ADD start_time TIMESTAMP WITHOUT TIME ZONE;

ALTER TABLE appointments
    ALTER COLUMN end_time SET NOT NULL;

ALTER TABLE appointments
    ALTER COLUMN start_time SET NOT NULL;

ALTER TABLE acceptances
    DROP COLUMN "end";

ALTER TABLE acceptances
    DROP COLUMN start;

ALTER TABLE appointments
    DROP COLUMN "end";

ALTER TABLE appointments
    DROP COLUMN start;
