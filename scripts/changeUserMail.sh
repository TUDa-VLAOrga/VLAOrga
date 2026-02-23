#!/bin/bash
if [ $# -ne 2 ]; then
    echo "Usage: $0 username email"
    exit 1;
fi

cd "$(dirname "$0")"
cd ..

# Includes the password in the environment variables (PGPASSWORD)
source .env

docker exec -it vlaorga-db-1 psql "postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:5432/$POSTGRES_DB" \
-c "UPDATE users SET email='$2' WHERE name='$1';"
