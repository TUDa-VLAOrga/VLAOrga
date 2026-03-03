# Backup of VLAOrga Database

## Check environment
Check that the .env file is correct

## Create Backup
For this, the docker of the database has to run.
If there is no backups folder in VLAOrga, create one.
In the VLAOrga folder, run the command:

    ./scripts/createDbBackup.sh 

A sql dump file should be created in the backups folder.

## Restore database with backup
In the VLAOrga folder, run the command:

    ./scripts/applyDbBackup.sh backups/file_name.sql
    
This deletes all data from the database and restores the state of the backup.

