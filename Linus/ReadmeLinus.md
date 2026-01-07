# Setup of Linus as development instance:

1. Clone linus as submodule by running (inside the Linus/ directory)
    
        VLAOrga/Linus $ git submodule init datenbank-physik

2. If the datenbank-physik folder is still empty:
   
        VLAOrga/Linus $ git submodule update --init

3. Then, create a file .env.local in the datenbank-physik repo with content

        DATABASE_URL=mysql://db_user:db_password@db:3306/db_name?serverVersion=5.7&charset=utf8mb4

4. Now you can build and run the application using

        VLAOrga/Linus $ docker compose up --build

    This command will take some time to build the images, and to start up linus web server as the mysql database needs to start first.

5. To be able to log in for testing, insert a dummy user (its password is `Füsik!`) into the database by hand:
    
        cat testdata.sql | docker compose exec -T db mysql db_name --user=db_user --password=db_password

6. Linus should now be accessible under http://localhost:8000, and you are able to log in with the username
    `admin` and password `Füsik!`.
