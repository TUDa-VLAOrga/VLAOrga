First, clone linus as submodule by running (inside the Linus/ directory)

    VLAOrga/Linus $ git submodule init datenbank-physik

Then, change .env in datenbank-physik repo to `DATABASE_URL=mysql://db_user:db_password@db:3306/db_name?serverVersion=5.7&charset=utf8mb4`

    docker compose up --build

Linus should now be accessible via localhost:8000
(It will take a moment for linus to start as the mysql database needs to start first)
