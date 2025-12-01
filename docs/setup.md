# Setup of VLAOrga

## Setting environment variables
Copy the `.env.template` file to file named `.env` in the same directory and adjust the usernames and passwords there.

## Build and run
For deployment, we ship preconfigured docker containers.
The only requirements are having `docker` installed, which ships `docker compose` by default in recent versions.

You can build and start them using

    docker compose up --build

Stop the containers with `Ctrl+C`.
If you want to start the containers in detached mode, run the following for starting and stopping:

    docker compose up --build -d
    docker compose stop

The frontend server can be reached under http://localhost:5173/
(In case of port conflicts, you can change the exposed ports in the `docker-compose.yml` file.)


## Backing up data

> To do: backing up the `vlaorga_postgres_data` docker volume should suffice as backup.
Figure out how to do that and write an instruction.


## Development

### Docker Containers

For development, you can build and start up the containers with the command above as well.
It will keep their output open in your current terminal session.

Docker has extensive caching capabilities, so on subsequent runs the containers will only be rebuilt if something changed.

If running some of front- or backend directly on your local host machine,
you can also just run and build the database container using

    docker compose [build|up] db

We however strongly recommend using the `db` container for the postgres database,
as setting up and configuring postgres on a local machine is not straightforward.

If you're running the backend inside a docker container, note that we build it including the Java binary,
so you need to rebuild the container every time the backend code changes.
You can build and start up only the backend container using:

    docker compose up --build backend

#### Running in detached mode

Start the containers in detached mode, so that the output does not block your terminal:

    docker compose up --build -d

Attach to some container output: 

    docker compose attach [db|backend|frontend]

More control over (also past) log output is available using the `docker compose logs` command.
Stop the detached containers using

    docker compose stop


### Running backend directly

#### Requirements

> To do: Java, Gradle, Spring boot (?)

#### Usage 

> To do: write instructions about the right gradle commands to invoke.


### Running frontend directly

#### Requirements

> To do. Vite, react, type script, ... (?)

#### Usage

Start up the frontend development server using vite:

    cd VLA-Frontend
    npm run dev
