ALTER TABLE persons
    ADD linus_user_name VARCHAR(255);

ALTER TABLE persons
    ADD CONSTRAINT uc_persons_linus_user UNIQUE (linus_user_id);

ALTER TABLE persons
    ADD CONSTRAINT uc_persons_linus_user_name UNIQUE (linus_user_name);

ALTER TABLE persons
DROP
COLUMN linus_user_id;

ALTER TABLE persons
    ADD linus_user_id INTEGER;

ALTER TABLE persons
    ADD CONSTRAINT uc_persons_linus_user UNIQUE (linus_user_id);