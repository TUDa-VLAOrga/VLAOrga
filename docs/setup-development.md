# Development setup

## Docker Containers

For managing development containers, use docker compose.
In general you can build and start up the containers with the following commands.

    docker compose build container_name  # build container
    docker compose up container_name  # start container. Will keep output blocking your current terminal session.
    docker compose up -d container_name  # start container, but do not output to terminal.
    docker compose up --build -d  # all of the above at once
    
    docker compose stop container_name  # stop container(s)

If you leave out `container_name`, the command will affect all containers.
The following container configurations are available:

* db: containig the postgres database of our application
* backend: containing the compiled backend java application and a nginx web server.

Additionally, for developing the interface to the external linus experiment application,
inside the _Linus/_ directory there are containers for a development instance of that.
For setup instructions, see <../Linus/Readme.md>


## Running backend directly

### Requirements

> To do: Java, Gradle, Spring boot (?)

### Usage

> To do: write instructions about the right gradle commands to invoke.


## Running frontend directly

### Requirements

> To do. Vite, react, type script, ... (?)

### Usage

Start up the frontend development server using vite:

    cd VLA-Frontend
    npm run dev

This by default runs the vite development server only locally. To expose it to the local network, run

    npm run dev -- --host
