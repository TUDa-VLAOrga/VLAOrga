# Setup of VLAOrga

## Requirements
This setup requires `git` and `docker` installed. Also, the credentials to a running database of a linus instance have to be known.

## Preparation
1. Clone the git repository:

        git clone https://github.com/TUDa-VLAOrga/VLAOrga.git

2. In the VLAOrga folder, copy the `.env.template` file to a file named `.env`.
3. In `.env`, change all `LINUS_` variables to the credentials of the linus instance, and all `POSTGRES_` variables to secure values.

## Starting the Software
Make sure that linus is running and reachable.

To start the software, run (in VLAOrga folder):

    docker compose --file docker-compose.prod.yml up -d

The application will launch on port 8080.

To stop the Software, run in VLAOrga folder:

    docker compose --file docker-compose.prod.yml stop

## Creating users

Refer to the [Modify Users](./modify-users.md) doc page for instructions
on how to create an initial user account from the command line.

## Backups
See [Backup instructions](./backup.md).

## For Development

See [Development Setup](./setup-development.md).
