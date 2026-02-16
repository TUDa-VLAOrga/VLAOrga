#!/bin/bash
if [ $# -ne 2 ]; then
    echo "Usage: $0 username password"
    exit 1;
fi

cd "$(dirname "$0")"

HASHED_USER_PASSWORD=$(./getHashedPassword.sh $2)

if [ $? -ne 0 ]; then
    echo "Error while creating password"
    echo $HASHED_USER_PASSWORD
    exit 1;
fi

cd ..

# Includes the password in the environment variables (PGPASSWORD)
source .env

docker exec -it vlaorga-db-1 psql "postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:5432/$POSTGRES_DB" \
-c "INSERT INTO users (name, password) VALUES ('$1', '$HASHED_USER_PASSWORD');"
