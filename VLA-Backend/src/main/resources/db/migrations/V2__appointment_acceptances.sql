CREATE SEQUENCE IF NOT EXISTS acceptances_seq START WITH 1 INCREMENT BY 50;

CREATE SEQUENCE IF NOT EXISTS appointment_series_seq START WITH 1 INCREMENT BY 50;

CREATE SEQUENCE IF NOT EXISTS appointments_seq START WITH 1 INCREMENT BY 50;

CREATE SEQUENCE IF NOT EXISTS reservation_experiment_seq START WITH 1 INCREMENT BY 50;

CREATE SEQUENCE IF NOT EXISTS reservation_seq START WITH 1 INCREMENT BY 50;

CREATE TABLE acceptances
(
    id             BIGINT NOT NULL,
    appointment_id BIGINT,
    start          TIMESTAMP WITHOUT TIME ZONE,
    "end"          TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT pk_acceptances PRIMARY KEY (id)
);

CREATE TABLE appointment_series
(
    id          BIGINT NOT NULL,
    lecture_id  BIGINT,
    category_id BIGINT,
    CONSTRAINT pk_appointment_series PRIMARY KEY (id)
);

CREATE TABLE appointments
(
    id        BIGINT                      NOT NULL,
    series_id BIGINT,
    start     TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    "end"     TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    notes     VARCHAR(255)                NOT NULL,
    CONSTRAINT pk_appointments PRIMARY KEY (id)
);

CREATE TABLE reservation
(
    id           BIGINT NOT NULL,
    user_id      BIGINT,
    ordertime    TIMESTAMP WITHOUT TIME ZONE,
    status       BIGINT,
    lecture_date TIMESTAMP WITHOUT TIME ZONE,
    comment      VARCHAR(255),
    name         VARCHAR(255),
    CONSTRAINT pk_reservation PRIMARY KEY (id)
);

CREATE TABLE reservation_experiment
(
    id             BIGINT NOT NULL,
    reservation_id BIGINT,
    experiment_id  BIGINT,
    user_id        BIGINT,
    status         BIGINT,
    pinned_on      TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT pk_reservation_experiment PRIMARY KEY (id)
);

ALTER TABLE acceptances
    ADD CONSTRAINT FK_ACCEPTANCES_ON_APPOINTMENT FOREIGN KEY (appointment_id) REFERENCES appointments (id);

ALTER TABLE appointments
    ADD CONSTRAINT FK_APPOINTMENTS_ON_SERIES FOREIGN KEY (series_id) REFERENCES appointment_series (id);

ALTER TABLE appointment_series
    ADD CONSTRAINT FK_APPOINTMENT_SERIES_ON_CATEGORY FOREIGN KEY (category_id) REFERENCES appointment_categories (id);

ALTER TABLE appointment_series
    ADD CONSTRAINT FK_APPOINTMENT_SERIES_ON_LECTURE FOREIGN KEY (lecture_id) REFERENCES lectures (id);
