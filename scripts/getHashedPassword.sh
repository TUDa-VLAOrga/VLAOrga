#!/bin/bash
if [ $# -ne 1 ]; then 
    echo "Usage: $0 password";
    exit 1;
fi

curl "http://localhost:8080/userManagement/unauthenticated/passwordConversion" \
     -d "$1" || \
(echo "The server must be running for this script to operate" && exit 1)