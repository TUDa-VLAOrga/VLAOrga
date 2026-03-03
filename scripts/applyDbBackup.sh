#!/bin/bash
VLAOrga_Path=~/Documents/Studium/TPSE/git/VLAOrga

cd $VLAOrga_Path

PG_FILE=${1}
if [[ ! -f $PG_FILE ]]; then
    echo "Please specify a existing PostgreSQL file."
    echo "Example: ./applyDbBackup.sh backups/vladb_dump_2026-03-02_15_53_47.sql"
    exit 1
fi

source .env
docker compose down --volumes db # deletes current db
docker compose up db -d
sleep 5s # wait for docker to boot
cat $PG_FILE | docker exec -i vlaorga-db-1 psql -q -X -U $POSTGRES_USER -d $POSTGRES_DB
# some errors here are normal, see https://www.postgresql.org/docs/current/app-pg-dumpall.html under notes

echo Dump restored
