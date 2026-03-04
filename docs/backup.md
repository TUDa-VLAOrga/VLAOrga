# Backup of VLAOrga Database

## Create Backup
For this, the docker container of the database (`db`)  has to run.

In the VLAOrga folder, run the command:

    ./scripts/createBackup.sh 

A sql dump file will be created in the backups folder. The folder will be created if a backup is created for the first time.

## Restore database with backup
In the VLAOrga folder, run the command:

    ./scripts/restoreBackup.sh backups/file_name.sql
    
This deletes all data from the database and restores the state of the backup. Afterwards the docker container of the app is restarted.

In this process, some errors are normal, see https://www.postgresql.org/docs/current/app-pg-dumpall.html under notes.

