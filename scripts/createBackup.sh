#!/bin/bash
CONTAINER_NAME=vlaorga-db-1

source .env
mkdir -p backups
docker exec -t $CONTAINER_NAME pg_dumpall -c -U $POSTGRES_USER > backups/vladb_dump_`date +%Y-%m-%d"_"%H_%M_%S`.sql
echo Dump created

