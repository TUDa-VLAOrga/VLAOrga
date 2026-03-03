#!/bin/bash
VLAOrga_Path=~/Documents/Studium/TPSE/git/VLAOrga

cd $VLAOrga_Path
source .env
docker exec -t vlaorga-db-1 pg_dumpall -c -U $POSTGRES_USER > backups/vladb_dump_`date +%Y-%m-%d"_"%H_%M_%S`.sql
echo Dump created
