#!/bin/bash

set -e 
 
#kill process
fuser -k 5100/tcp 2>/dev/null || true
docker compose up -d --build 

echo "BUILD COMPLETE"
echo "...RUNNING..."
docker ps 