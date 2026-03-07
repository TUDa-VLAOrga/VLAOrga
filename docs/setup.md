# Setup of VLAOrga

## Requirements
This setup requires `git` and `docker` installed. Also, the access parameters to a running database of a linus instance have to be known.

## Preparation
1. Clone the git repository:

    git clone https://github.com/TUDa-VLAOrga/VLAOrga.git

2. In the VLAOrga folder, copy the `.env.template` file to a file named `.env`.
3. Change all `LINUS_` variables in `.env` to a correct value.

## Starting the Software
Start the software by running (in VLAOrga folder):

    docker compose --file docker-compose.prod.yml up -d

The Software can now be accessed under: http://<servername>:8080/

To stop the Software, run (in VLAOrga folder):

    docker compose --file docker-compose.prod.yml stop

## Creating users

Refer to the [Modify Users](./modify-users.md) doc page for instructions
on how to create an initial user account from the command line.

## Backups
See [Backup instructions](./backup.md).

## For Development

See [Development Setup](./setup-development.md).
