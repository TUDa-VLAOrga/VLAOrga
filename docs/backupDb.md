# Backup of VLAOrga Database

## Create Backup
For this, the docker container of the database (`db`)  has to run.

In the VLAOrga folder, run the command:

    ./scripts/createBackup.sh 

A sql dump file will be created in the backups folder.

## Restore database with backup
In the VLAOrga folder, run the command:

    ./scripts/restoreBackup.sh backups/file_name.sql
    
This deletes all data from the database and restores the state of the backup.

In this process, some errors are normal, see https://www.postgresql.org/docs/current/app-pg-dumpall.html under notes.

