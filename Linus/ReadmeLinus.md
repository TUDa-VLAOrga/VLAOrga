# Setup of Linus as development instance:

1. Clone linus as submodule by running (inside the Linus/ directory)
    
        VLAOrga/Linus $ git submodule init datenbank-physik

2. Then, create a file .env.local in the datenbank-physik repo with content

        DATABASE_URL=mysql://db_user:db_password@db:3306/db_name?serverVersion=5.7&charset=utf8mb4

3. To be able to log in for testing, edit the file `Linus/datenbank-physik/src/security/LoginFormAuthenticator.php`
    and change the function `checkCredentials` to a simple `return true;`.
    
    > ToDo: alternatively figure out how to execute the file `src/DataFixturesTestfixtures.php` from the command line, 
    > Johannes had not enough PHP knowledge to find out whether and how that's possible.

4. Now you can build and run the application using

        VLAOrga/Linus $ docker compose up --build

    Wait a minute for linus to start as the mysql database needs to start first.

5. Create an admin user by running

        VLAOrga/Linus $ docker compose exec db mysql db_name --user=db_user --password=db_password -e 'INSERT INTO user (name, password, email, roles) VALUES ("admin", "", "vla@example.com", "[\"ROLE_VLA\"]")'
    
6. Linus should now be accessible under http://localhost:8000, and you are able to log in with the username
    `admin` and any password.
