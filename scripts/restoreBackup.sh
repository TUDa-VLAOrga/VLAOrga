#!/bin/bash

PG_FILE=$1
if [[ ! -f $PG_FILE ]]; then
    echo "Please specify an existing PostgreSQL file."
    echo "Example: ./applyDbBackup.sh backups/vladb_dump_2026-03-02_15_53_47.sql"
    exit 1
fi

source .env
docker compose --file docker-compose.prod.yml stop prod-app
docker compose down --volumes db # deletes current db
docker compose --file docker-compose.prod.yml up db -d
sleep 5s # wait for docker to boot
cat $PG_FILE | docker compose exec --no-tty db psql --quiet --no-psqlrc --username=$POSTGRES_USER --dbname=$POSTGRES_DB
# some errors here are normal, see https://www.postgresql.org/docs/current/app-pg-dumpall.html under notes
echo Dump restored successfully

docker compose --file docker-compose.prod.yml up prod-app -d

