# Help for Database Migrations

We use flyway for migrating our db schema.
In the directory `/src/main/resources/db/migrations` is a chronologically named history of our DB schema.
On application startup, hibernate will validate that the database is up-to-date
and, if necessary, apply missing migrations.

## Generating a migration
When introducing a new entity or changing something there, it is needed to write a migration SQL file
first of all to migrate the production database to the newest schema.

This can be done in IntelliJ with the following steps

1. Start up db container: ```docker compose up -d db```
2. Install JPA Buddy Plugin
3. Configure a Datasource in IntelliJ for the project
    (credentials are in .env, server running on localhost port 5432 according to docker-compose.services.yml)
4. You should now get red error annotations in every entity class whose table is not present in the DB.
    On hovering, there's a context menu to generate a new migration.
    Choose source type Model and as target the configured datasource.
    Move the generated SQL file to the resources/db/migrations directory.
5. Start the application container, to apply the migration: ```docker compose up dev-app```

(The migration-generation steps are explained in Point 4 of this tutorial, too:
<https://www.baeldung.com/database-migrations-with-flyway>)


## Broken / outdated schema? -> reset database

During development it can happen that the schema is outdated or not conforming to any migration step.
Easiest in this case is to reset the db completely and let flyway re-apply the newest schema.
**This looses all data**

Remove the db docker container, together with its persistence volume:

```
docker compose down --volumes db
```

Start db container again together with app, you should see in the Spring boot logs that migrations were applied

```
docker compose up --build db dev-app
```

(alternatively, if you wish to have the db container running in background)

```
docker compose up -d db
docker compose up --build dev-app
```
