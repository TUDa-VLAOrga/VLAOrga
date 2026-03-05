#!/usr/bin/env bash
if [ $# -ne 3 ]; then
    echo "Usage: $0 username password mail"
    exit 1;
fi

cd "$(dirname "$0")"

./addUserWithPassword.sh $1 $2
./changeUserMail.sh $1 $3

cd ..
