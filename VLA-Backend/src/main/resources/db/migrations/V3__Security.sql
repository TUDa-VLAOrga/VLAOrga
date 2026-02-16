ALTER TABLE users
    ADD password VARCHAR(255);

ALTER TABLE users
    ADD CONSTRAINT uc_users_email UNIQUE (email);

ALTER TABLE users
    ADD CONSTRAINT uc_users_name UNIQUE (name);