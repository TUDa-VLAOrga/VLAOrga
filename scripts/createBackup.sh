#!/bin/bash

source .env
docker compose --file docker-compose.prod.yml stop prod-app
mkdir -p backups
docker compose exec -t db pg_dumpall --clean --username=$POSTGRES_USER > backups/vladb_dump_`date +%Y-%m-%d"_"%H_%M_%S`.sql
echo Backup successfully created
docker compose --file docker-compose.prod.yml up prod-app -d

