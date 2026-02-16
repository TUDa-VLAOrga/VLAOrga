CREATE SEQUENCE IF NOT EXISTS appointment_categories_seq START WITH 1 INCREMENT BY 50;

CREATE SEQUENCE IF NOT EXISTS lectures_seq START WITH 1 INCREMENT BY 50;

CREATE SEQUENCE IF NOT EXISTS persons_seq START WITH 1 INCREMENT BY 50;

CREATE SEQUENCE IF NOT EXISTS users_seq START WITH 1 INCREMENT BY 50;

CREATE TABLE appointment_categories
(
    id    BIGINT       NOT NULL,
    title VARCHAR(255) NOT NULL,
    CONSTRAINT pk_appointment_categories PRIMARY KEY (id)
);

CREATE TABLE lectures
(
    id       BIGINT       NOT NULL,
    name     VARCHAR(255) NOT NULL,
    semester VARCHAR(255) NOT NULL,
    color    VARCHAR(255) NOT NULL,
    CONSTRAINT pk_lectures PRIMARY KEY (id)
);

CREATE TABLE persons
(
    id            BIGINT       NOT NULL,
    name          VARCHAR(255) NOT NULL,
    notes         VARCHAR(255) NOT NULL,
    linus_user_id BIGINT,
    CONSTRAINT pk_persons PRIMARY KEY (id)
);

CREATE TABLE users
(
    id    BIGINT NOT NULL,
    name  VARCHAR(255),
    email VARCHAR(255),
    CONSTRAINT pk_users PRIMARY KEY (id)
);

ALTER TABLE appointment_categories
    ADD CONSTRAINT uc_appointment_categories_title UNIQUE (title);
