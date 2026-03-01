ALTER TABLE users
    ADD password VARCHAR(255);

ALTER TABLE users
    ADD CONSTRAINT uc_users_email UNIQUE (email);

ALTER TABLE users
    ADD CONSTRAINT uc_users_name UNIQUE (name);

DROP SEQUENCE users_seq CASCADE;

ALTER TABLE users
    ALTER COLUMN email DROP NOT NULL;

CREATE SEQUENCE IF NOT EXISTS users_id_seq;
ALTER TABLE users
    ALTER COLUMN id SET NOT NULL;
ALTER TABLE users
    ALTER COLUMN id SET DEFAULT nextval('users_id_seq');

ALTER SEQUENCE users_id_seq OWNED BY users.id;