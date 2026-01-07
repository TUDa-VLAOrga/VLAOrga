# Setup of VLAOrga

## Setting environment variables
Copy the `.env.template` file to file named `.env` in the same directory and adjust the usernames and passwords there.

## Build and run
For deployment, we ship preconfigured docker containers.
The only requirements are having `docker` installed, which ships `docker compose` by default in recent versions.

You can build and start them using

    docker compose up --build

This keeps the containers running andblocking the current terminal.
Stop the containers with `Ctrl+C`.

If you want to start the containers in detached mode, i.e. not blocking the terminal,
run the following for starting and stopping:

    docker compose up --build -d
    docker compose stop

The frontend server can be reached under http://localhost:5173/
(In case of port conflicts, you can change the exposed ports in the `docker-compose.yml` file.)


## Backing up data

> To do: backing up the `vlaorga_postgres_data` docker volume should suffice as backup.
Figure out how to do that and write an instruction.


## Development

See <./setup-development.md>.
